<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\BlogComment;
use App\Models\SmtpSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class BlogCommentController extends Controller
{
    /**
     * Well-known disposable/temp email domains.
     * Kept inline to avoid a file-system dependency.
     */
    private const DISPOSABLE_DOMAINS = [
        'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
        'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info', 'guerrillamail.l.com',
        'sharklasers.com', 'guerrillamailblock.com', 'grr.la', 'guerrillamail.net',
        'spam4.me', 'yopmail.com', 'yopmail.fr', 'cool.fr.nf', 'jetable.fr.nf',
        'nospam.ze.tc', 'nomail.xl.cx', 'mega.zik.dj', 'speed.1s.fr', 'courriel.fr.nf',
        'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf', 'trashmail.at',
        'trashmail.com', 'trashmail.io', 'trashmail.me', 'trashmail.net', 'trashmail.org',
        'trashmail.xyz', 'throwam.com', 'throwam.net', 'throwam.org',
        'dispostable.com', 'discard.email', 'discardmail.com', 'discardmail.de',
        'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
        'mailnull.com', 'spamavert.com', 'spamherelots.com', 'spamhereplease.com',
        'tempr.email', 'tempm.com', 'tempmail.com', 'tempmail.net', 'tempmail.org',
        'temp-mail.io', 'temp-mail.org', 'temporarymail.com',
        'fakeinbox.com', 'fakeinbox.net', 'throwam.com', 'throwam.net',
        'maildrop.cc', 'mailnesia.com', 'mailnull.com', 'spamspot.com',
        'spamgob.com', 'spamthis.co.uk', 'spaml.com', 'spaml.de',
        'getairmail.com', 'airmail.ga', '10minutemail.com', '10minutemail.net',
        '10minutemail.org', '10minemail.com', 'minutemail.com',
        'getnada.com', 'nada.ltd', 'nada.email',
        'mailtemp.info', 'inboxalias.com', 'inboxkitten.com',
        'crazymailing.com', 'disinbox.com', 'dispostable.com',
        'ezweb.ne.jp', 'harakirimail.com', 'jetable.com', 'jetable.fr.nf',
        'zetmail.com', 'zoemail.net', 'tempinbox.com',
    ];

    /**
     * POST /blog/{slug}/comments
     */
    public function store(Request $request, string $slug)
    {
        $post = BlogPost::where('slug', $slug)->firstOrFail();

        // 1. Validate basic fields
        $validated = $request->validate([
            'name'       => 'required|string|max:100',
            'email'      => 'required|email:rfc,dns|max:255',
            'body'       => 'required|string|min:5|max:2000',
            'parent_id'  => 'nullable|integer|exists:blog_comments,id',
            'recaptcha_token' => 'required|string',
        ], [
            'body.min'   => 'Your comment is too short (minimum 5 characters).',
            'body.max'   => 'Your comment is too long (maximum 2000 characters).',
            'recaptcha_token.required' => 'Security verification failed. Please refresh and try again.',
        ]);

        // 2. Block disposable / temp email domains
        $emailDomain = strtolower(substr(strrchr($validated['email'], '@'), 1));
        if (in_array($emailDomain, self::DISPOSABLE_DOMAINS, true)) {
            throw ValidationException::withMessages([
                'email' => 'Disposable or temporary email addresses are not allowed. Please use your real email.',
            ]);
        }

        // 3. Verify reCAPTCHA v3 token
        $recaptchaSecret = config('services.recaptcha.secret');
        if ($recaptchaSecret) {
            try {
                $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                    'secret'   => $recaptchaSecret,
                    'response' => $validated['recaptcha_token'],
                    'remoteip' => $request->ip(),
                ]);
                $result = $response->json();

                if (!($result['success'] ?? false) || ($result['score'] ?? 0) < 0.5) {
                    throw ValidationException::withMessages([
                        'recaptcha_token' => 'Security check failed. Please try again.',
                    ]);
                }
            } catch (\Exception $e) {
                Log::warning('reCAPTCHA verification error: ' . $e->getMessage());
                // If reCAPTCHA API is down, fail open (don't block the user)
            }
        }

        // 4. If replying to a comment, ensure it belongs to the same post
        if ($validated['parent_id'] ?? null) {
            $parent = BlogComment::findOrFail($validated['parent_id']);
            if ($parent->blog_post_id !== $post->id) {
                throw ValidationException::withMessages([
                    'parent_id' => 'Invalid reply target.',
                ]);
            }
        }

        // 5. Save comment as pending
        $comment = BlogComment::create([
            'blog_post_id' => $post->id,
            'parent_id'    => $validated['parent_id'] ?? null,
            'name'         => $validated['name'],
            'email'        => $validated['email'],
            'body'         => $validated['body'],
            'status'       => 'pending',
            'ip_address'   => $request->ip(),
            'user_agent'   => substr($request->userAgent() ?? '', 0, 512),
        ]);

        return back()->with('comment_submitted', true);
    }
}
