<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Models\Visit;
use Illuminate\Support\Str;

class TrackVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Perform tracking after response generation to optimize UI load speed
        if ($response->getStatusCode() >= 200 && $response->getStatusCode() < 400) {
            $this->recordVisit($request);
        }

        return $response;
    }

    protected function recordVisit(Request $request)
    {
        // Prevent logging your own visits when logged into the admin dashboard or using skip_analytics cookie
        if (auth()->check() || $request->hasCookie('skip_analytics')) {
            return;
        }

        // Exclude specific IP addresses (configured in .env)
        $excludedIps = explode(',', env('EXCLUDED_IPS', ''));
        $excludedIps[] = '127.0.0.1';
        $excludedIps[] = '::1';
        if (in_array($request->ip(), array_filter(array_map('trim', $excludedIps)))) {
            return;
        }

        $path = $request->path();

        // Ignore tracking administrative assets, system APIs, and debug endpoints
        $ignoredPrefixes = ['admin', 'login', '_debugbar', 'vite', 'sanctum', 'api', 'register', 'dashboard'];
        foreach ($ignoredPrefixes as $prefix) {
            if (Str::startsWith($path, $prefix)) {
                return;
            }
        }

        // Safe string limit on paths
        $path = '/' . ltrim($path, '/');
        $userAgent = $request->header('User-Agent') ?? '';
        
        // Skip obvious bots and crawlers to avoid polluting metrics
        if (preg_match('/bot|crawl|slurp|spider|mediapartners/i', $userAgent)) {
            return;
        }

        // Hashed IP logic (privacy-first unique identifier per day)
        $ipHash = hash('sha256', $request->ip() . date('Y-m-d'));

        // ACCURACY THROTTLE: Do not count multiple refreshes of the same page from the same user within 15 minutes
        $recentVisit = Visit::where('ip_hash', $ipHash)
            ->where('url_path', $path)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->exists();

        if ($recentVisit) {
            return;
        }

        $browser = $this->parseBrowser($userAgent);
        $platform = $this->parsePlatform($userAgent);

        Visit::create([
            'ip_hash' => $ipHash,
            'url_path' => $path,
            'referer' => $this->getDomainFromReferer($request->headers->get('referer')),
            'browser' => $browser,
            'platform' => $platform,
        ]);
    }

    protected function parseBrowser($ua)
    {
        if (strpos($ua, 'OPR/') !== false) return 'Opera';
        if (strpos($ua, 'Edg/') !== false) return 'Edge';
        if (strpos($ua, 'Chrome/') !== false) return 'Chrome';
        if (strpos($ua, 'Safari/') !== false) return 'Safari';
        if (strpos($ua, 'Firefox/') !== false) return 'Firefox';
        return 'Other';
    }

    protected function parsePlatform($ua)
    {
        if (strpos($ua, 'Windows') !== false) return 'Windows';
        if (strpos($ua, 'iPhone') !== false) return 'iPhone';
        if (strpos($ua, 'iPad') !== false) return 'iPad';
        if (strpos($ua, 'Macintosh') !== false) return 'macOS';
        if (strpos($ua, 'Android') !== false) return 'Android';
        if (strpos($ua, 'Linux') !== false) return 'Linux';
        return 'Other';
    }

    protected function getDomainFromReferer($referer)
    {
        if (!$referer) return 'Direct';
        $parsed = parse_url($referer);
        $host = $parsed['host'] ?? 'Direct';
        return $host;
    }
}
