<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingSetting;
use App\Models\GoogleToken;
use App\Models\Profile;
use Carbon\Carbon;
use Google\Client;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\ConferenceData;
use Google\Service\Calendar\CreateConferenceRequest;
use Google\Service\Calendar\ConferenceSolutionKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\CallBookingReceived;

class ContactBookingController extends Controller
{
    /**
     * Get available timeslots for a selected date.
     */
    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'date' => 'required|date_format:Y-m-d'
        ]);

        $selectedDate = Carbon::parse($request->date);
        $settings = BookingSetting::first();

        if (!$settings) {
            return response()->json(['slots' => []]);
        }

        // 1. Check if day is enabled
        $dayName = strtolower($selectedDate->englishDayOfWeek);
        if (!in_array($dayName, $settings->days_of_week)) {
            return response()->json(['slots' => []]);
        }

        // 2. Generate candidate slots
        $start = Carbon::parse($request->date . ' ' . $settings->work_hours_start);
        $end = Carbon::parse($request->date . ' ' . $settings->work_hours_end);
        $duration = $settings->slot_duration;

        $candidates = [];
        $current = clone $start;

        while ($current->lt($end)) {
            $slotEnd = (clone $current)->addMinutes($duration);
            if ($slotEnd->gt($end)) break;

            $candidates[] = [
                'time' => $current->format('H:i:s'),
                'label' => $current->format('g:i A'),
                'carbon' => clone $current,
            ];
            $current->addMinutes($duration);
        }

        // 3. Fetch existing bookings to exclude
        $existingBookings = Booking::whereDate('scheduled_at', $selectedDate)
            ->where('status', 'confirmed')
            ->pluck('scheduled_at')
            ->map(fn($dt) => $dt->format('H:i:s'))
            ->toArray();

        // 4. Filter out booked times and past times
        $availableSlots = [];
        $now = Carbon::now();

        foreach ($candidates as $candidate) {
            // Skip if already booked
            if (in_array($candidate['time'], $existingBookings)) {
                continue;
            }

            // Skip if slot is in the past
            if ($candidate['carbon']->lt($now)) {
                continue;
            }

            $availableSlots[] = [
                'time' => $candidate['time'],
                'label' => $candidate['label']
            ];
        }

        return response()->json(['slots' => $availableSlots]);
    }

    /**
     * Book a confirmed slot and generate Google Meet URL if synced.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i:s',
            'brief_notes' => 'nullable|string|max:500',
            'timezone' => 'required|string',
        ]);

        $scheduledAt = Carbon::parse($request->date . ' ' . $request->time);
        
        // Double check vacancy
        $exists = Booking::where('scheduled_at', $scheduledAt)
            ->where('status', 'confirmed')
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Sorry, that slot was just booked by someone else! Please select another time.'], 422);
        }

        $booking = new Booking();
        $booking->name = $request->name;
        $booking->email = $request->email;
        $booking->scheduled_at = $scheduledAt;
        $booking->timezone = $request->timezone;
        $booking->brief_notes = $request->brief_notes;
        $booking->status = 'confirmed';
        
        // Handshake Google integration
        $this->attemptGoogleMeetSync($booking);

        $booking->save();

        // Dispatch dynamic e-mail alert
        try {
            $adminEmail = Profile::first()?->email ?? config('mail.from.address');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new CallBookingReceived($booking));
            }
        } catch (\Exception $e) {
            Log::warning("Failed dispatching call reservation mail: " . $e->getMessage());
        }

        return response()->json([
            'message' => 'Call booked successfully!',
            'booking' => $booking
        ]);
    }

    /**
     * Refresh access token & automatically append Google Meet event if token exists.
     */
    private function attemptGoogleMeetSync(Booking $booking)
    {
        $tokenModel = GoogleToken::first();
        if (!$tokenModel) return; // not connected

        try {
            $client = new Client();
            $client->setClientId(config('services.google.client_id'));
            $client->setClientSecret(config('services.google.client_secret'));
            
            $accessToken = [
                'access_token' => $tokenModel->access_token,
                'refresh_token' => $tokenModel->refresh_token,
                'expires_in' => $tokenModel->expires_in,
                'created' => $tokenModel->created_at_timestamp
            ];
            
            $client->setAccessToken($accessToken);

            // 1. Handle Token Expiry and Refresh silently
            if ($client->isAccessTokenExpired()) {
                if ($tokenModel->refresh_token) {
                    $newToken = $client->fetchAccessTokenWithRefreshToken($tokenModel->refresh_token);
                    
                    if (isset($newToken['error'])) {
                         Log::warning("Failed to refresh Google Token silently: " . json_encode($newToken));
                         return;
                    }

                    $tokenModel->access_token = $newToken['access_token'];
                    $tokenModel->expires_in = $newToken['expires_in'];
                    $tokenModel->created_at_timestamp = time();
                    $tokenModel->save();

                    $client->setAccessToken($tokenModel->access_token);
                } else {
                    Log::warning("Access token expired and no refresh token exists.");
                    return;
                }
            }

            // 2. Instigate Calendar API
            $service = new Calendar($client);
            
            // Get Duration
            $settings = BookingSetting::first();
            $duration = $settings ? $settings->slot_duration : 30;
            
            $startCarbon = Carbon::parse($booking->scheduled_at);
            $endCarbon = (clone $startCarbon)->addMinutes($duration);

            // Generate Unique Request ID for Meet API (important!)
            $conferenceRequestId = 'meet_' . uniqid();

            $event = new Event([
                'summary' => 'Discovery Call: ' . $booking->name,
                'description' => "Brief:\n" . ($booking->brief_notes ?? 'No notes supplied.'),
                'start' => [
                    'dateTime' => $startCarbon->toIso8601String(),
                    'timeZone' => 'UTC',
                ],
                'end' => [
                    'dateTime' => $endCarbon->toIso8601String(),
                    'timeZone' => 'UTC',
                ],
                'attendees' => [
                    ['email' => $booking->email],
                ],
                // Construct Hangouts Meet solution
                'conferenceData' => new ConferenceData([
                    'createRequest' => new CreateConferenceRequest([
                        'requestId' => $conferenceRequestId,
                        'conferenceSolutionKey' => new ConferenceSolutionKey([
                            'type' => 'hangoutsMeet'
                        ])
                    ])
                ])
            ]);

            // Save Event triggering Meet sync
            $calendarId = 'primary';
            $createdEvent = $service->events->insert($calendarId, $event, ['conferenceDataVersion' => 1]);

            $booking->google_event_id = $createdEvent->getId();
            
            // Extract Link
            $entryPoints = $createdEvent->getConferenceData()?->getEntryPoints();
            if (!empty($entryPoints)) {
                foreach ($entryPoints as $entryPoint) {
                    if ($entryPoint->getEntryPointType() === 'video') {
                        $booking->google_meet_url = $entryPoint->getUri();
                        break;
                    }
                }
            }

        } catch (\Exception $e) {
            Log::error("Error constructing Google Meet Event for booking: " . $e->getMessage());
        }
    }
}
