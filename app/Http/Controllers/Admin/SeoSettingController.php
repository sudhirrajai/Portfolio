<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Models\SeoSetting;
use App\Models\SearchConsoleMetric;
use App\Models\SearchConsoleUrlInspection;
use App\Models\SeoRedirect;
use App\Models\SeoHealthIssue;
use App\Services\GoogleSearchConsoleService;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    public function index(GoogleSearchConsoleService $gsc)
    {
        $globalSeo = SeoSetting::where('page_key', 'global')->first();
        if (!$globalSeo) {
            $globalSeo = SeoSetting::create([
                'page_key' => 'global',
                'page_title' => 'Global SEO Settings',
                'meta_description' => 'Global settings for search engine verification and visitor tracking.',
                'meta_keywords' => null,
            ]);
        }

        $performanceOverview = $gsc->getPerformanceOverview();
        $healthIssues = SeoHealthIssue::where('is_resolved', false)->orderByDesc('detected_at')->get();
        $redirects = SeoRedirect::orderByDesc('hits')->orderByDesc('updated_at')->get();
        $inspections = SearchConsoleUrlInspection::orderByDesc('inspected_at')->get();

        return Inertia::render('Admin/Seo/Index', [
            'seoSettings'         => SeoSetting::where('page_key', '!=', 'global')->orderBy('page_key', 'asc')->get(),
            'globalSeo'           => $globalSeo,
            'gscConnected'        => $gsc->isConnected(),
            'gscSiteUrl'          => $gsc->getSiteUrl(),
            'performanceOverview' => $performanceOverview,
            'healthIssues'        => $healthIssues,
            'redirects'           => $redirects,
            'inspections'         => $inspections,
        ]);
    }

    public function update(Request $request, SeoSetting $seo)
    {
        if ($seo->page_key === 'global') {
            $validated = $request->validate([
                'google_analytics_id' => 'nullable|string|max:50',
                'google_search_console_id' => 'nullable|string|max:100',
                'custom_meta_tags' => 'nullable|string',
                'google_analytics_property_id' => 'nullable|string|max:50',
                'google_analytics_credentials_json' => 'nullable|string',
                'llm_instructions' => 'nullable|string',
            ]);
        } else {
            $validated = $request->validate([
                'page_title' => 'required|string|max:150',
                'meta_description' => 'required|string|max:300',
                'meta_keywords' => 'nullable|string|max:500',
            ]);
        }

        $seo->update($validated);

        return redirect()->back()->with('message', 'SEO Settings saved successfully!');
    }

    public function syncGsc(Request $request)
    {
        set_time_limit(180);

        if ($request->boolean('inspect')) {
            Artisan::call('seo:sync-gsc', ['--inspect' => true]);
            $output = Artisan::output();
            return redirect()->back()
                ->with('message', 'Search Console rankings & deep URL inspections completed!')
                ->with('console_output', $output);
        }

        Artisan::call('seo:sync-gsc');
        $output = Artisan::output();
        return redirect()->back()
            ->with('message', 'Search Console metrics synced successfully!')
            ->with('console_output', $output);
    }

    public function runHealthCheck()
    {
        set_time_limit(180);
        Artisan::call('seo:health-check');
        $output = Artisan::output();

        return redirect()->back()
            ->with('message', 'Internal site health audit completed!')
            ->with('console_output', $output);
    }

    public function inspectUrl(Request $request, GoogleSearchConsoleService $gsc)
    {
        $request->validate(['url' => 'required|string']);
        $result = $gsc->inspectUrl($request->input('url'));

        if ($result) {
            $formatted = "Google URL Inspection Result for {$request->input('url')}:\n" .
                "• Verdict: " . ($result['verdict'] ?? 'N/A') . "\n" .
                "• Coverage State: " . ($result['coverage_state'] ?? 'N/A') . "\n" .
                "• Robots.txt: " . ($result['robots_txt_state'] ?? 'N/A') . "\n" .
                "• Indexing State: " . ($result['indexing_state'] ?? 'N/A') . "\n" .
                "• Page Fetch: " . ($result['page_fetch_state'] ?? 'N/A') . "\n" .
                "• Google Canonical: " . ($result['google_canonical'] ?? 'N/A') . "\n" .
                "• User Canonical: " . ($result['user_canonical'] ?? 'N/A') . "\n" .
                "• Last Crawl: " . ($result['last_crawl_time'] ?? 'N/A') . "\n";

            return redirect()->back()
                ->with('message', "URL inspection completed for {$request->input('url')}!")
                ->with('console_output', $formatted);
        }

        return redirect()->back()->with('error', "Failed to inspect URL. Check Search Console API permissions.");
    }

    public function storeRedirect(Request $request)
    {
        $validated = $request->validate([
            'source_path' => 'required|string|max:500',
            'target_path' => 'required|string|max:500',
            'status_code' => 'required|integer|in:301,302',
            'notes'       => 'nullable|string|max:255',
        ]);

        $sourcePath = '/' . ltrim($validated['source_path'], '/');
        $targetPath = '/' . ltrim($validated['target_path'], '/');

        SeoRedirect::updateOrCreate(
            ['source_path' => $sourcePath],
            [
                'target_path' => $targetPath,
                'status_code' => $validated['status_code'],
                'notes'       => $validated['notes'] ?: 'Manually added in Admin',
                'is_active'   => true,
            ]
        );

        return redirect()->back()->with('message', "301 Redirect rule configured: {$sourcePath} → {$targetPath}");
    }

    public function deleteRedirect(SeoRedirect $redirect)
    {
        $redirect->delete();
        return redirect()->back()->with('message', 'Redirect rule deleted.');
    }
}
