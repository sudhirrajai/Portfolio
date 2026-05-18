<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Visit;
use App\Models\Project;
use App\Models\BlogPost;
use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Core Statistics Card Counts
        $totalViews = Visit::count();
        $uniqueVisitors = Visit::distinct('ip_hash')->count();
        $todayViews = Visit::whereDate('created_at', now()->toDateString())->count();
        $todayUniques = Visit::whereDate('created_at', now()->toDateString())->distinct('ip_hash')->count();

        // Top Visited Pages (URLs)
        $topPages = Visit::select('url_path', DB::raw('count(*) as total_views'))
            ->groupBy('url_path')
            ->orderByDesc('total_views')
            ->limit(5)
            ->get();

        // Top Traffic Sources (Referrers)
        $topReferrers = Visit::select('referer', DB::raw('count(*) as occurrences'))
            ->groupBy('referer')
            ->orderByDesc('occurrences')
            ->limit(5)
            ->get();

        // Browser Breakdown
        $browsers = Visit::select('browser', DB::raw('count(*) as count'))
            ->groupBy('browser')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Operating System Breakdown
        $platforms = Visit::select('platform', DB::raw('count(*) as count'))
            ->groupBy('platform')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // Extra helpful counts
        $projectCount = Project::count();
        $blogCount = BlogPost::count();
        $unreadMessages = Message::count(); // Total inbox size for dashboard alerts

        // Daily Visited Chart Data (last 7 days)
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
        ]);
    }
}
