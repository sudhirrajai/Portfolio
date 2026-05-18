<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SmtpSetting;
use App\Mail\SmtpConnectionTestMail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MailSettingsController extends Controller
{
    /**
     * Display current SMTP server settings.
     */
    public function index()
    {
        $settings = SmtpSetting::first() ?? new SmtpSetting([
            'port' => 587,
            'encryption' => 'tls',
        ]);

        return Inertia::render('Admin/Mail/Index', [
            'settings' => $settings
        ]);
    }

    /**
     * Save SMTP configuration settings.
     */
    public function update(Request $request)
    {
        $request->validate([
            'host' => 'nullable|string|max:255',
            'port' => 'nullable|integer|min:1|max:65535',
            'username' => 'nullable|string|max:255',
            'password' => 'nullable|string|max:255',
            'encryption' => 'nullable|string|max:10',
            'from_address' => 'nullable|email|max:255',
            'from_name' => 'nullable|string|max:255',
        ]);

        $settings = SmtpSetting::firstOrNew([]);
        $settings->fill($request->all());
        $settings->save();

        return back()->with('message', 'SMTP Configurations saved successfully.');
    }

    /**
     * Perform dynamic runtime test-mail connection dispatch.
     */
    public function sendTestMail(Request $request)
    {
        $request->validate([
            'destination_email' => 'required|email',
            // Verify full config present to try testing
            'host' => 'required|string',
            'port' => 'required|integer',
            'username' => 'required|string',
            'password' => 'required|string',
            'encryption' => 'required|string',
            'from_address' => 'required|email',
            'from_name' => 'required|string',
        ]);

        try {
            // 1. Dynamically override settings specifically for this runtime session
            config([
                'mail.mailers.smtp.host' => $request->host,
                'mail.mailers.smtp.port' => (int)$request->port,
                'mail.mailers.smtp.username' => $request->username,
                'mail.mailers.smtp.password' => $request->password,
                'mail.mailers.smtp.encryption' => $request->encryption,
                'mail.from.address' => $request->from_address,
                'mail.from.name' => $request->from_name,
            ]);

            // 2. Purge cached Mailer singleton instance so Laravel recreates transport using new configs! (Crucial!)
            app()->make('mail.manager')->forgetMailers();

            // 3. Instigate real dispatch
            Mail::to($request->destination_email)->send(new SmtpConnectionTestMail());

            return back()->with('message', 'Test Email sent successfully! Please check your inbox/spam.');

        } catch (\Exception $e) {
            Log::error('Admin SMTP Test Failure: ' . $e->getMessage());
            
            return back()->withErrors([
                'test_error' => 'Connection Failed: ' . $e->getMessage()
            ]);
        }
    }
}
