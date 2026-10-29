<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Http\Request;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use App\Models\CaseStudy;
use App\Models\Project;
use App\Models\SeoHealthIssue;

class SeoHealthCheckCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seo:health-check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Audit internal site URLs for 404s, slow response times, missing meta tags and broken SEO elements';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Starting automated SEO health audit on all site URLs...');

        $routes = [
            '/',
            '/about',
            '/work',
            '/blog',
            '/case-studies',
            '/contact',
            '/open-labs',
            '/roadmap',
            '/sitemap.xml',
            '/robots.txt',
            '/llms.txt',
            '/llms-full.txt',
            '/feed.xml',
            '/developer.json',
        ];

        foreach (BlogPost::all() as $post) {
            $routes[] = "/blog/{$post->slug}";
        }

        foreach (BlogCategory::all() as $cat) {
            $routes[] = "/blog/category/{$cat->slug}";
        }

        foreach (CaseStudy::where('is_published', true)->get() as $cs) {
            $routes[] = "/case-studies/{$cs->slug}";
        }

        foreach (Project::all() as $p) {
            $routes[] = "/work/{$p->slug}";
        }

        $total = count($routes);
        $this->info("Discovered {$total} unique URLs to audit.");

        $kernel = app()->make(\Illuminate\Contracts\Http\Kernel::class);

        $passed = 0;
        $warnings = 0;
        $errors = 0;

        // Clear existing unresolved issues so we refresh latest audit state
        SeoHealthIssue::where('is_resolved', false)->delete();

        $rows = [];

        foreach ($routes as $path) {
            $startTime = microtime(true);
            $request = Request::create($path, 'GET');
            
            try {
                $response = $kernel->handle($request);
                $durationMs = round((microtime(true) - $startTime) * 1000);
                $status = $response->getStatusCode();
                $content = $response->getContent();

                if ($status >= 400) {
                    $errors++;
                    SeoHealthIssue::create([
                        'url'         => $path,
                        'issue_type'  => "http_{$status}_error",
                        'severity'    => 'critical',
                        'status_code' => $status,
                        'details'     => ['path' => $path, 'status' => $status],
                    ]);
                    $rows[] = [$path, "<fg=red>{$status}</>", "{$durationMs}ms", '<fg=red>FAIL (HTTP Error)</>'];
                    continue;
                }

                $issues = [];

                // Slow response check
                if ($durationMs > 1200) {
                    $warnings++;
                    $issues[] = "Slow response ({$durationMs}ms)";
                    SeoHealthIssue::create([
                        'url'         => $path,
                        'issue_type'  => 'slow_response',
                        'severity'    => 'warning',
                        'status_code' => $status,
                        'details'     => ['duration_ms' => $durationMs],
                    ]);
                }

                // If HTML response, inspect SEO tags
                if (str_contains($response->headers->get('content-type', ''), 'text/html')) {
                    // Check title
                    if (!preg_match('/<title[^>]*>(.*?)<\/title>/is', $content, $m) || empty(trim($m[1]))) {
                        $warnings++;
                        $issues[] = 'Missing <title>';
                        SeoHealthIssue::create([
                            'url'         => $path,
                            'issue_type'  => 'missing_title',
                            'severity'    => 'critical',
                            'status_code' => $status,
                            'details'     => ['message' => 'Empty or missing title tag'],
                        ]);
                    }

                    // Check meta description (excluding machine txt endpoints)
                    if (!preg_match('/<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']/is', $content, $m) || empty(trim($m[1]))) {
                        // Inertia pages render SEOHead client-side, check for Inertia page key or server fallback
                        if (!str_contains($content, 'data-page')) {
                            $warnings++;
                            $issues[] = 'Missing meta description';
                            SeoHealthIssue::create([
                                'url'         => $path,
                                'issue_type'  => 'missing_meta_description',
                                'severity'    => 'warning',
                                'status_code' => $status,
                                'details'     => ['message' => 'Missing meta description tag'],
                            ]);
                        }
                    }
                }

                if (empty($issues)) {
                    $passed++;
                    $rows[] = [$path, "<fg=green>{$status}</>", "{$durationMs}ms", '<fg=green>PASS</>'];
                } else {
                    $rows[] = [$path, "<fg=yellow>{$status}</>", "{$durationMs}ms", '<fg=yellow>' . implode(', ', $issues) . '</>'];
                }

            } catch (\Throwable $e) {
                $errors++;
                SeoHealthIssue::create([
                    'url'         => $path,
                    'issue_type'  => 'exception',
                    'severity'    => 'critical',
                    'status_code' => 500,
                    'details'     => ['error' => $e->getMessage()],
                ]);
                $rows[] = [$path, '<fg=red>ERR</>', '0ms', '<fg=red>' . substr($e->getMessage(), 0, 40) . '</>'];
            }
        }

        $this->table(['Path', 'Status', 'Response Time', 'Health Verdict'], $rows);

        $this->newLine();
        $this->info("Audit Finished: {$passed} Passed, {$warnings} Warnings, {$errors} Critical Errors.");

        return $errors > 0 ? self::FAILURE : self::SUCCESS;
    }
}

