<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Profile;
use App\Models\BookingSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactInquiryReceived;

class ContactController extends Controller
{
    public function index()
    {
        $profile = Profile::first();
        $bookingSetting = BookingSetting::first();
        
        // Default true if not explicitly disabled
        $isBookingActive = $bookingSetting ? (bool)$bookingSetting->is_active : true;

        return Inertia::render('Portfolio/Contact', [
            'profile' => $profile,
            'isBookingActive' => $isBookingActive,
        ]);
    }

    public function getCaptchaImage()
    {
        // Clear any old session cache immediately
        session()->forget('captcha_answer');

        // Generate a highly readable 5-character alphanumeric code (omitting confusing O,0,1,I)
        $permitted_chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
        $code = '';
        $charLen = strlen($permitted_chars);
        for ($i = 0; $i < 5; $i++) {
            $code .= $permitted_chars[rand(0, $charLen - 1)];
        }

        // Store lowercase answer in server-side PHP session for case-insensitive validation
        session(['captcha_answer' => strtolower($code)]);

        $width = 160;
        $height = 46;
        
        // Phase 1: Draw elements on a flat temporary canvas
        $tempImg = imagecreatetruecolor($width, $height);
        
        // Allocate pure white background color
        $bg = imagecolorallocate($tempImg, 255, 255, 255);
        imagefilledrectangle($tempImg, 0, 0, $width, $height, $bg);

        // Draw extremely faint background noise to not interfere with readability
        for ($i = 0; $i < 4; $i++) {
            $color = imagecolorallocate($tempImg, rand(240, 248), rand(240, 248), rand(240, 248));
            imagefilledellipse($tempImg, rand(0, $width), rand(0, $height), rand(10, 20), rand(10, 20), $color);
        }

        // Write alphanumeric characters with clear horizontal distribution and mild jitter
        $len = strlen($code);
        for ($i = 0; $i < $len; $i++) {
            // Pick distinct high-contrast dark colors (blues, grays, blacks)
            $charColor = imagecolorallocate($tempImg, rand(5, 40), rand(5, 40), rand(5, 40));
            $x = 18 + ($i * 26); // Wide spacing so letters never collide
            $y = 14 + rand(-2, 2); // Tighter vertical variance
            
            // Draw character 4 times with 1px offset to simulate a heavy, bold font style
            imagestring($tempImg, 5, $x, $y, $code[$i], $charColor);
            imagestring($tempImg, 5, $x + 1, $y, $code[$i], $charColor);
            imagestring($tempImg, 5, $x, $y + 1, $code[$i], $charColor);
            imagestring($tempImg, 5, $x + 1, $y + 1, $code[$i], $charColor);
        }

        // Phase 2: Apply VERY mild Sine-Wave displacement to preserve legibility!
        $finalImg = imagecreatetruecolor($width, $height);
        $finalBg = imagecolorallocate($finalImg, 255, 255, 255);
        imagefill($finalImg, 0, 0, $finalBg);

        $waveFreq = rand(6, 8) / 100;    // Slower frequency ripple
        $waveAmp = 1.0;                  // Low amplitude displacement keeps letters intact
        
        for ($x = 0; $x < $width; $x++) {
            for ($y = 0; $y < $height; $y++) {
                // Mild coordinates displacement
                $dx = $x + sin($y * $waveFreq) * $waveAmp;
                $dy = $y + sin($x * $waveFreq) * 0.4; // Substantially lower vertical wave prevents squishing
                
                if ($dx >= 0 && $dx < $width && $dy >= 0 && $dy < $height) {
                    $colorIdx = imagecolorat($tempImg, (int)$dx, (int)$dy);
                    imagesetpixel($finalImg, $x, $y, $colorIdx);
                }
            }
        }

        // Phase 3: Only 2 thin overlay lines to satisfy anti-OCR while maximizing legibility
        for ($i = 0; $i < 2; $i++) {
            $lineColor = imagecolorallocate($finalImg, rand(160, 190), rand(160, 190), rand(180, 210));
            imageline($finalImg, 0, rand(10, $height-10), $width, rand(10, $height-10), $lineColor);
        }

        // Cleanup base buffer
        imagedestroy($tempImg);

        // Buffer stream binary extraction
        ob_start();
        imagepng($finalImg);
        $imageData = ob_get_clean();
        imagedestroy($finalImg);

        // Respond directly as raw PNG stream bypassing standard view engines
        return response($imageData)
            ->header('Content-Type', 'image/png')
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0')
            ->header('Pragma', 'no-cache');
    }

    public function store(Request $request)
    {
        // ANTI-BOT PROTECTION 1: Honeypot check. 
        if ($request->filled('fax_number')) {
            return back()->with('message', 'Message processing initiated.');
        }

        // ANTI-BOT PROTECTION 2: Secure Session String Captcha match verification (Case Insensitive)
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'message' => 'required|string|min:10|max:1000',
            'captcha_input' => [
                'required',
                'string',
                function ($attribute, $value, $fail) {
                    $correct = session('captcha_answer');
                    $submitted = strtolower(trim($value));
                    
                    if (is_null($correct) || $submitted !== strtolower(trim($correct))) {
                        $fail('The security code is incorrect. Please type the characters exactly as they appear.');
                    }
                },
            ],
        ], [
            'captcha_input.required' => 'Please complete the security check.',
        ]);

        // Clear captcha from session so it cannot be re-submitted/re-used
        session()->forget('captcha_answer');

        // Persist real contact inquiry
        $msg = Message::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'message' => $validated['message'],
        ]);

        // Dispatch e-mail alert with try-catch fallback (using DB SMTP config if present)
        try {
            $smtp = \App\Models\SmtpSetting::first();
            if ($smtp && !empty($smtp->host)) {
                config([
                    'mail.default' => 'smtp',
                    'mail.mailers.smtp.host' => $smtp->host,
                    'mail.mailers.smtp.port' => (int)$smtp->port,
                    'mail.mailers.smtp.username' => $smtp->username,
                    'mail.mailers.smtp.password' => $smtp->password,
                    'mail.mailers.smtp.encryption' => $smtp->encryption,
                    'mail.from.address' => $smtp->from_address,
                    'mail.from.name' => $smtp->from_name,
                ]);
                app()->make('mail.manager')->forgetMailers();
            }

            $adminEmail = Profile::first()?->email ?? \App\Models\User::first()?->email ?? config('mail.from.address');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new ContactInquiryReceived($msg));
            }
        } catch (\Exception $e) {
            // Silently capture connection errors so user submission still succeeds
            \Illuminate\Support\Facades\Log::warning("Failed dispatching contact inquiry mail: " . $e->getMessage());
        }

        return back()->with('message', 'Your message has been successfully received! I will reach out shortly.');
    }
}
