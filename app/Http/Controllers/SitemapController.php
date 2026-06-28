<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use App\Models\Project;
use App\Models\BlogPost;
use App\Models\BlogCategory;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function sitemap(): Response
    {
        $now = Carbon::now()->toAtomString();

        // 1. Static Pages
        $urls = [
            ['loc' => url('/'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/about'), 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/work'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/open-labs'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/roadmap'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/blog'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.8'],
            ['loc' => url('/contact'), 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
        ];

        // 2. Dynamic Projects
        $projects = Project::orderBy('year', 'desc')->get();
        foreach ($projects as $project) {
            $urls[] = [
                'loc' => url("/work/{$project->slug}"),
                'lastmod' => $project->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        // 3. Dynamic Blog Posts
        $posts = BlogPost::orderBy('created_at', 'desc')->get();
        foreach ($posts as $post) {
            $urls[] = [
                'loc' => url("/blog/{$post->slug}"),
                'lastmod' => $post->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        // 4. Dynamic Blog Categories
        $categories = BlogCategory::all();
        foreach ($categories as $category) {
            $urls[] = [
                'loc' => url("/blog/category/{$category->slug}"),
                'lastmod' => $category->updated_at->toAtomString(),
                'changefreq' => 'weekly',
                'priority' => '0.6'
            ];
        }

        // Build XML content
        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        
        foreach ($urls as $url) {
            $xml .= '<url>';
            $xml .= '<loc>' . htmlspecialchars($url['loc']) . '</loc>';
            $xml .= '<lastmod>' . $url['lastmod'] . '</lastmod>';
            $xml .= '<changefreq>' . $url['changefreq'] . '</changefreq>';
            $xml .= '<priority>' . $url['priority'] . '</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)
            ->header('Content-Type', 'application/xml');
    }

    public function robots(): Response
    {
        $sitemapUrl = url('sitemap.xml');

        $content = "User-agent: *\n";
        $content .= "Allow: /\n\n";
        
        // Disallow private endpoints
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /dashboard\n";
        $content .= "Disallow: /login\n";
        $content .= "Disallow: /register\n\n";
        
        // Reference dynamic sitemap
        $content .= "Sitemap: {$sitemapUrl}\n";

        return response($content, 200)
            ->header('Content-Type', 'text/plain');
    }
}
