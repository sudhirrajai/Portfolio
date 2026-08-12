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

        // 1. Static Pages & Key Machine Resources
        $urls = [
            ['loc' => url('/'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '1.0'],
            ['loc' => url('/about'), 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.8'],
            ['loc' => url('/work'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.8'],
            ['loc' => url('/open-labs'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/roadmap'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.7'],
            ['loc' => url('/blog'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.8'],
            ['loc' => url('/case-studies'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.8'],
            ['loc' => url('/contact'), 'lastmod' => $now, 'changefreq' => 'monthly', 'priority' => '0.7'],
            ['loc' => url('/llms.txt'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => url('/llms-full.txt'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.9'],
            ['loc' => url('/feed.xml'), 'lastmod' => $now, 'changefreq' => 'daily', 'priority' => '0.8'],
            ['loc' => url('/developer.json'), 'lastmod' => $now, 'changefreq' => 'weekly', 'priority' => '0.8'],
        ];

        // 2. Dynamic Projects
        $projects = Project::orderBy('year', 'desc')->get();
        foreach ($projects as $project) {
            $urls[] = [
                'loc' => url("/work/{$project->slug}"),
                'lastmod' => $project->updated_at ? $project->updated_at->toAtomString() : $now,
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        // 3. Dynamic Blog Posts
        $posts = BlogPost::orderBy('created_at', 'desc')->get();
        foreach ($posts as $post) {
            $urls[] = [
                'loc' => url("/blog/{$post->slug}"),
                'lastmod' => $post->updated_at ? $post->updated_at->toAtomString() : $now,
                'changefreq' => 'weekly',
                'priority' => '0.7'
            ];
        }

        // 4. Dynamic Blog Categories
        $categories = BlogCategory::all();
        foreach ($categories as $category) {
            $urls[] = [
                'loc' => url("/blog/category/{$category->slug}"),
                'lastmod' => $category->updated_at ? $category->updated_at->toAtomString() : $now,
                'changefreq' => 'weekly',
                'priority' => '0.6'
            ];
        }

        // 5. Dynamic Case Studies
        $caseStudies = \App\Models\CaseStudy::where('is_published', true)->orderBy('created_at', 'desc')->get();
        foreach ($caseStudies as $case) {
            $urls[] = [
                'loc' => url("/case-studies/{$case->slug}"),
                'lastmod' => $case->updated_at ? $case->updated_at->toAtomString() : $now,
                'changefreq' => 'weekly',
                'priority' => '0.8'
            ];
        }

        // 6. Dynamic Case Study Categories
        $caseCategories = \App\Models\CaseStudyCategory::all();
        foreach ($caseCategories as $category) {
            $urls[] = [
                'loc' => url("/case-studies/category/{$category->slug}"),
                'lastmod' => $category->updated_at ? $category->updated_at->toAtomString() : $now,
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
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }

    public function robots(): Response
    {
        $sitemapUrl = url('sitemap.xml');
        $llmsTxtUrl = url('llms.txt');

        $content = "User-agent: *\n";
        $content .= "Allow: /\n";
        $content .= "Allow: /llms.txt\n";
        $content .= "Allow: /llms-full.txt\n";
        $content .= "Allow: /feed.xml\n";
        $content .= "Allow: /developer.json\n\n";
        
        // Explicitly allow AI Search Engine & LLM Crawlers
        $aiBots = [
            'GPTBot',
            'ChatGPT-User',
            'PerplexityBot',
            'ClaudeBot',
            'Claude-Web',
            'Bytespider',
            'Applebot-Extended',
            'CCBot',
            'Google-Extended',
        ];

        foreach ($aiBots as $bot) {
            $content .= "User-agent: {$bot}\n";
            $content .= "Allow: /\n";
            $content .= "Allow: /llms.txt\n";
            $content .= "Allow: /llms-full.txt\n\n";
        }

        // Disallow private admin/auth endpoints
        $content .= "User-agent: *\n";
        $content .= "Disallow: /admin/\n";
        $content .= "Disallow: /dashboard\n";
        $content .= "Disallow: /login\n";
        $content .= "Disallow: /register\n";
        $content .= "Disallow: /api/\n\n";
        
        // Machine-readable discovery headers
        $content .= "Sitemap: {$sitemapUrl}\n";
        $content .= "LLMs-Txt: {$llmsTxtUrl}\n";

        return response($content, 200)
            ->header('Content-Type', 'text/plain; charset=utf-8');
    }
}
