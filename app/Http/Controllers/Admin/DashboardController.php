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
        // 1. Extra helpful counts
        $projectCount = Project::count();
        $blogCount = BlogPost::count();
        $unreadMessages = Message::count();

        // 2. Local Database Statistics (default fallbacks)
        $totalViews = Visit::count();
        $uniqueVisitors = Visit::distinct('ip_hash')->count();
        $todayViews = Visit::whereDate('created_at', now()->toDateString())->count();
        $todayUniques = Visit::whereDate('created_at', now()->toDateString())->distinct('ip_hash')->count();

        $topPages = Visit::select('url_path', DB::raw('count(*) as total_views'))
            ->groupBy('url_path')
            ->orderByDesc('total_views')
            ->limit(5)
            ->get()
            ->toArray();

        $topReferrers = Visit::select('referer', DB::raw('count(*) as occurrences'))
            ->groupBy('referer')
            ->orderByDesc('occurrences')
            ->limit(5)
            ->get()
            ->toArray();

        $browsers = Visit::select('browser', DB::raw('count(*) as count'))
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        $platforms = Visit::select('platform', DB::raw('count(*) as count'))
            ->groupBy('platform')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->toArray();

        $last7Days = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $label = now()->subDays($i)->format('D, M j');
            $views = Visit::whereDate('created_at', $date)->count();
            $uniques = Visit::whereDate('created_at', $date)->distinct('ip_hash')->count();
            $last7Days[] = [
                'date_label' => $label,
                'views' => $views,
                'uniques' => $uniques
            ];
        }

        $dataSource = 'local_database';

        // 3. Attempt Google Analytics 4 integration
        $globalSeo = SeoSetting::where('page_key', 'global')->first();
        if ($globalSeo && !empty($globalSeo->google_analytics_property_id) && !empty($globalSeo->google_analytics_credentials_json)) {
            $gaService = new GoogleAnalyticsService($globalSeo->google_analytics_credentials_json);
            if ($gaService->isConnected()) {
                $gaOverview = $gaService->getOverviewStats($globalSeo->google_analytics_property_id);
                if (!empty($gaOverview)) {
                    $totalViews = $gaOverview['total_views'];
                    $uniqueVisitors = $gaOverview['unique_visitors'];
                    $todayViews = $gaOverview['today_views'];
                    $todayUniques = $gaOverview['today_uniques'];

                    // Load GA4 dynamic breakdown lists
                    $gaPages = $gaService->getTopPages($globalSeo->google_analytics_property_id);
                    if (!empty($gaPages)) $topPages = $gaPages;

                    $gaRefs = $gaService->getTopReferrers($globalSeo->google_analytics_property_id);
                    if (!empty($gaRefs)) $topReferrers = $gaRefs;

                    $gaDeviceOS = $gaService->getDeviceAndOSBreakdown($globalSeo->google_analytics_property_id);
                    if (!empty($gaDeviceOS['browsers'])) $browsers = $gaDeviceOS['browsers'];
                    if (!empty($gaDeviceOS['platforms'])) $platforms = $gaDeviceOS['platforms'];

                    $gaDaily = $gaService->getDailyTraffic($globalSeo->google_analytics_property_id);
                    if (!empty($gaDaily)) $last7Days = $gaDaily;

                    $dataSource = 'google_analytics';
                }
            }
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_views' => $totalViews,
                'unique_visitors' => $uniqueVisitors,
                'today_views' => $todayViews,
                'today_uniques' => $todayUniques,
                'projects' => $projectCount,
                'blogs' => $blogCount,
                'unread_messages' => $unreadMessages,
            ],
            'top_pages' => $topPages,
            'top_referrers' => $topReferrers,
            'browsers' => $browsers,
            'platforms' => $platforms,
            'chart_data' => $last7Days,
            'data_source' => $dataSource,
        ]);
    }
}
