<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Schema;
use App\Models\SeoRedirect;
use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Project;

class HandleSeoRedirects
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Safe check for migrations / test setups
        if (!Schema::hasTable('seo_redirects')) {
            return $next($request);
        }

        $path = '/' . ltrim($request->path(), '/');

        // 1. Check explicit redirect rules
        $redirect = SeoRedirect::where('source_path', $path)
            ->where('is_active', true)
            ->first();

        if ($redirect) {
            $redirect->recordHit();
            return redirect($redirect->target_path, $redirect->status_code);
        }

        $response = $next($request);

        // 2. Self-Healing 404 Engine: If a request fails with 404, attempt smart fuzzy match
        if ($response->getStatusCode() === 404 && $request->isMethod('GET')) {
            $autoRedirectUrl = $this->attemptAutoHealing($path);
            if ($autoRedirectUrl) {
                // Save auto-healed rule so future requests hit fast DB lookup
                SeoRedirect::create([
                    'source_path' => $path,
                    'target_path' => $autoRedirectUrl,
                    'status_code' => 301,
                    'hits'        => 1,
                    'is_active'   => true,
                    'last_hit_at' => now(),
                    'notes'       => 'Auto-healed from 404 by SEO Engine',
                ]);

                return redirect($autoRedirectUrl, 301);
            }
        }

        return $response;
    }

    /**
     * Fuzzy match broken URLs to their closest active target.
     */
    protected function attemptAutoHealing(string $path): ?string
    {
        if (!Schema::hasTable('blog_posts')) {
            return null;
        }

        // A. Handle /blog/{broken-slug}
        if (preg_match('#^/blog/([^/]+)$#', $path, $matches)) {
            $brokenSlug = strtolower(trim($matches[1]));
            $posts = BlogPost::select('slug')->get();

            $bestMatch = null;
            $bestScore = 0;

            foreach ($posts as $post) {
                $candidate = strtolower($post->slug);

                if (str_contains($candidate, $brokenSlug) || str_contains($brokenSlug, $candidate)) {
                    return "/blog/{$post->slug}";
                }

                $brokenWords = array_filter(explode('-', $brokenSlug));
                $candidateWords = array_filter(explode('-', $candidate));
                $commonWords = array_intersect($brokenWords, $candidateWords);
                $wordScore = count($commonWords);

                if ($wordScore >= 2 && $wordScore > $bestScore) {
                    $bestScore = $wordScore;
                    $bestMatch = "/blog/{$post->slug}";
                }

                similar_text($brokenSlug, $candidate, $percent);
                if ($percent > 50 && ($percent / 10) > $bestScore) {
                    $bestScore = $percent / 10;
                    $bestMatch = "/blog/{$post->slug}";
                }
            }

            if ($bestMatch) {
                return $bestMatch;
            }
        }

        // B. Handle /case-studies/{broken-slug}
        if (Schema::hasTable('case_studies') && preg_match('#^/case-studies/([^/]+)$#', $path, $matches)) {
            $brokenSlug = strtolower(trim($matches[1]));
            $cases = CaseStudy::where('is_published', true)->select('slug')->get();

            $bestMatch = null;
            $bestScore = 0;

            foreach ($cases as $case) {
                $candidate = strtolower($case->slug);

                if (str_contains($candidate, $brokenSlug) || str_contains($brokenSlug, $candidate)) {
                    return "/case-studies/{$case->slug}";
                }

                $brokenWords = array_filter(explode('-', $brokenSlug));
                $candidateWords = array_filter(explode('-', $candidate));
                $commonWords = array_intersect($brokenWords, $candidateWords);
                $wordScore = count($commonWords);

                if ($wordScore >= 2 && $wordScore > $bestScore) {
                    $bestScore = $wordScore;
                    $bestMatch = "/case-studies/{$case->slug}";
                }
            }

            if ($bestMatch) {
                return $bestMatch;
            }
        }

        // C. Handle /work/{broken-slug}
        if (Schema::hasTable('projects') && preg_match('#^/work/([^/]+)$#', $path, $matches)) {
            $brokenSlug = strtolower(trim($matches[1]));
            $projects = Project::select('slug')->get();

            foreach ($projects as $project) {
                $candidate = strtolower($project->slug);
                if (str_contains($candidate, $brokenSlug) || str_contains($brokenSlug, $candidate)) {
                    return "/work/{$project->slug}";
                }
            }
        }

        return null;
    }
}
