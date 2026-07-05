<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Visit;
use App\Models\Project;
use App\Models\BlogPost;
use App\Models\Message;
use App\Models\SeoSetting;
use App\Services\GoogleAnalyticsService;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Exclude admin from traffic tracking on this browser for 5 years
        cookie()->queue('skip_analytics', '1', 60 * 24 * 365 * 5);

        // 1. Extra helpful counts
        $projectCount = Project::count();
        $blogCount = BlogPost::count();
        $unreadMessages = Message::count();

        // 2. Local Database Statistics
        $localTotalViews = Visit::count();
        $localUniqueVisitors = Visit::distinct('ip_hash')->count();
        $localTodayViews = Visit::whereDate('created_at', now()->toDateString())->count();
        $localTodayUniques = Visit::whereDate('created_at', now()->toDateString())->distinct('ip_hash')->count();

        $localTopPages = Visit::select('url_path', DB::raw('count(*) as total_views'))
            ->groupBy('url_path')
            ->orderByDesc('total_views')
            ->limit(5)
            ->get()
            ->toArray();

        $localTopReferrers = Visit::select('referer', DB::raw('count(*) as occurrences'))
            ->groupBy('referer')
            ->orderByDesc('occurrences')
            ->limit(5)
            ->get()
            ->toArray();

        $localBrowsers = Visit::select('browser', DB::raw('count(*) as count'))
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        $localPlatforms = Visit::select('platform', DB::raw('count(*) as count'))
            ->groupBy('platform')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        $localLast7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $label = now()->subDays($i)->format('D, M j');
            $views = Visit::whereDate('created_at', $date)->count();
            $uniques = Visit::whereDate('created_at', $date)->distinct('ip_hash')->count();
            $localLast7Days[] = [
                'date_label' => $label,
                'views' => $views,
                'uniques' => $uniques
            ];
        }

        $localData = [
            'stats' => [
                'total_views' => $localTotalViews,
                'unique_visitors' => $localUniqueVisitors,
                'today_views' => $localTodayViews,
                'today_uniques' => $localTodayUniques,
            ],
            'top_pages' => $localTopPages,
            'top_referrers' => $localTopReferrers,
            'browsers' => $localBrowsers,
            'platforms' => $localPlatforms,
            'chart_data' => $localLast7Days,
        ];

        // 3. Attempt Google Analytics 4 integration
        $gaData = null;
        $globalSeo = SeoSetting::where('page_key', 'global')->first();
        if ($globalSeo && !empty($globalSeo->google_analytics_property_id) && !empty($globalSeo->google_analytics_credentials_json)) {
            $gaService = new GoogleAnalyticsService($globalSeo->google_analytics_credentials_json);
            if ($gaService->isConnected()) {
                $gaOverview = $gaService->getOverviewStats($globalSeo->google_analytics_property_id);
                if (!empty($gaOverview)) {
                    $gaData = [
                        'stats' => [
                            'total_views' => $gaOverview['total_views'],
                            'unique_visitors' => $gaOverview['unique_visitors'],
                            'today_views' => $gaOverview['today_views'],
                            'today_uniques' => $gaOverview['today_uniques'],
                        ],
                        'top_pages' => $gaService->getTopPages($globalSeo->google_analytics_property_id) ?? [],
                        'top_referrers' => $gaService->getTopReferrers($globalSeo->google_analytics_property_id) ?? [],
                        'browsers' => [],
                        'platforms' => [],
                        'chart_data' => $gaService->getDailyTraffic($globalSeo->google_analytics_property_id) ?? [],
                    ];

                    $gaDeviceOS = $gaService->getDeviceAndOSBreakdown($globalSeo->google_analytics_property_id);
                    if (!empty($gaDeviceOS['browsers'])) {
                        $gaData['browsers'] = $gaDeviceOS['browsers'];
                    }
                    if (!empty($gaDeviceOS['platforms'])) {
                        $gaData['platforms'] = $gaDeviceOS['platforms'];
                    }
                }
            }
        }

        return Inertia::render('Dashboard', [
            'local_data' => $localData,
            'ga_data' => $gaData,
            'content_stats' => [
                'projects' => $projectCount,
                'blogs' => $blogCount,
                'unread_messages' => $unreadMessages,
            ]
        ]);
    }
}
