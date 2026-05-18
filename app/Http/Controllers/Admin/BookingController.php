<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingSetting;
use App\Models\GoogleToken;
use Google\Client;
use Google\Service\Calendar;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BookingController extends Controller
{
    /**
     * Display the admin bookings agenda and config screen.
     */
    public function index()
    {
        $bookings = Booking::orderBy('scheduled_at', 'desc')->paginate(15);
        $settings = BookingSetting::first();
        $token = GoogleToken::first();

        return Inertia::render('Admin/Bookings/Index', [
            'bookings' => $bookings,
            'settings' => $settings,
            'isGoogleConnected' => !!$token,
            'googleAccountEmail' => $token ? $token->account_email : null,
        ]);
    }

    /**
     * Update availability days, hours, and durations.
     */
    public function updateSettings(Request $request)
    {
        $request->validate([
            'is_active' => 'required|boolean',
            'days_of_week' => 'required|array',
            'work_hours_start' => 'required',
            'work_hours_end' => 'required',
            'slot_duration' => 'required|integer|min:15|max:120',
        ]);

        $settings = BookingSetting::firstOrNew([]);
        $settings->is_active = $request->is_active;
        $settings->days_of_week = $request->days_of_week;
        $settings->work_hours_start = $request->work_hours_start;
        $settings->work_hours_end = $request->work_hours_end;
        $settings->slot_duration = $request->slot_duration;
        $settings->save();

        return back()->with('message', 'Availability configurations saved successfully.');
    }

    /**
     * Redirect user to Google OAuth secure screen.
     */
    public function redirectToGoogle()
    {
        // Fetch Client details from ENV
        $clientId = config('services.google.client_id');
        $clientSecret = config('services.google.client_secret');

        if (empty($clientId) || empty($clientSecret)) {
            return back()->withErrors(['error' => 'Google API credentials are not configured in your .env file! Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.']);
        }

        $client = new Client();
        $client->setClientId($clientId);
        $client->setClientSecret($clientSecret);
        $client->setRedirectUri(route('admin.google.callback'));
        
        // Important: Force offline access to retrieve an long-lived Refresh Token
        $client->setAccessType('offline');
        $client->setApprovalPrompt('force'); 
        $client->addScope(Calendar::CALENDAR);
        $client->addScope('email');
        $client->addScope('profile');

        $authUrl = $client->createAuthUrl();
        return Inertia::location($authUrl);
    }

    /**
     * Handle Google secure callback.
     */
    public function handleGoogleCallback(Request $request)
    {
        if (!$request->has('code')) {
            return redirect()->route('admin.bookings.index')->withErrors(['error' => 'Authorization code not returned from Google.']);
        }

        try {
            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            $client->setRedirectUri(route('admin.google.callback'));

            $tokenResponse = $client->fetchAccessTokenWithAuthCode($request->input('code'));

            if (isset($tokenResponse['error'])) {
                return redirect()->route('admin.bookings.index')->withErrors(['error' => 'Google API Error: ' . $tokenResponse['error_description']]);
            }

            $client->setAccessToken($tokenResponse);

            // Get User Identity info
            $oauth = new \Google\Service\Oauth2($client);
            $userInfo = $oauth->userinfo->get();

            // Save credentials (clearing any old ones first)
            GoogleToken::truncate();
            GoogleToken::create([
                'account_email' => $userInfo->email,
                'access_token' => $tokenResponse['access_token'],
                'refresh_token' => $tokenResponse['refresh_token'] ?? null, // Nullable if they already consented previously without 'force'
                'expires_in' => $tokenResponse['expires_in'],
                'created_at_timestamp' => time(),
            ]);

            return redirect()->route('admin.bookings.index')->with('message', 'Successfully connected your Google Calendar account!');

        } catch (\Exception $e) {
            Log::error("Google Connection Failure: " . $e->getMessage());
            return redirect()->route('admin.bookings.index')->withErrors(['error' => 'An error occurred while authenticating with Google: ' . $e->getMessage()]);
        }
    }

    /**
     * Disconnect user account.
     */
    public function revokeGoogleConnection()
    {
        GoogleToken::truncate();
        return back()->with('message', 'Successfully disconnected your Google Calendar integration.');
    }

    /**
     * Cancel / Delete booking record.
     */
    public function destroy(Booking $booking)
    {
        $booking->delete();
        return back()->with('message', 'Meeting successfully removed from agenda log.');
    }
}
