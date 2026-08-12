<?php

namespace App\Http\Controllers;

use App\Models\BlogPost;
use App\Models\CaseStudy;
use App\Models\Profile;
use Illuminate\Http\Response;
use Carbon\Carbon;

class FeedController extends Controller
{
    /**
     * Generate RSS 2.0 XML Feed for Blog Posts and Case Studies.
     */
    public function index(): Response
    {
        $profile = Profile::first();
        $siteTitle = ($profile?->name ?? 'Portfolio') . ' - Engineering Blog & Case Studies';
        $siteDesc = $profile?->tagline ?? $profile?->summary ?? 'Articles, technical case studies, and software development insights.';
        $siteUrl = url('/');
        $feedUrl = url('/feed.xml');

        // Fetch latest blog posts
        $posts = BlogPost::orderBy('created_at', 'desc')->take(20)->get();

        // Fetch published case studies
        $caseStudies = CaseStudy::where('is_published', true)->orderBy('created_at', 'desc')->take(10)->get();

        $items = collect();

        foreach ($posts as $post) {
            $items->push([
                'title' => $post->title,
                'link' => url("/blog/{$post->slug}"),
                'guid' => url("/blog/{$post->slug}"),
                'pubDate' => ($post->created_at ?? Carbon::now())->toRssString(),
                'description' => $post->excerpt,
                'content' => $post->content,
                'category' => 'Blog Post',
                'author' => $profile?->name ?? 'Author',
            ]);
        }

        foreach ($caseStudies as $case) {
            $items->push([
                'title' => "[Case Study] {$case->title}",
                'link' => url("/case-studies/{$case->slug}"),
                'guid' => url("/case-studies/{$case->slug}"),
                'pubDate' => ($case->created_at ?? Carbon::now())->toRssString(),
                'description' => $case->summary,
                'content' => $case->content,
                'category' => 'Case Study',
                'author' => $profile?->name ?? 'Author',
            ]);
        }

        // Sort items by pubDate descending
        $sortedItems = $items->sortByDesc('pubDate');

        $latestDate = $sortedItems->first()['pubDate'] ?? Carbon::now()->toRssString();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">';
        $xml .= '<channel>';
        $xml .= '<title>' . htmlspecialchars($siteTitle, ENT_XML1) . '</title>';
        $xml .= '<link>' . htmlspecialchars($siteUrl, ENT_XML1) . '</link>';
        $xml .= '<description>' . htmlspecialchars($siteDesc, ENT_XML1) . '</description>';
        $xml .= '<language>en-us</language>';
        $xml .= '<lastBuildDate>' . $latestDate . '</lastBuildDate>';
        $xml .= '<atom:link href="' . htmlspecialchars($feedUrl, ENT_XML1) . '" rel="self" type="application/rss+xml" />';

        foreach ($sortedItems as $item) {
            $xml .= '<item>';
            $xml .= '<title>' . htmlspecialchars($item['title'], ENT_XML1) . '</title>';
            $xml .= '<link>' . htmlspecialchars($item['link'], ENT_XML1) . '</link>';
            $xml .= '<guid isPermaLink="true">' . htmlspecialchars($item['guid'], ENT_XML1) . '</guid>';
            $xml .= '<pubDate>' . $item['pubDate'] . '</pubDate>';
            $xml .= '<dc:creator>' . htmlspecialchars($item['author'], ENT_XML1) . '</dc:creator>';
            $xml .= '<category>' . htmlspecialchars($item['category'], ENT_XML1) . '</category>';
            $xml .= '<description><![CDATA[' . $item['description'] . ']]></description>';
            $xml .= '<content:encoded><![CDATA[' . $item['content'] . ']]></content:encoded>';
            $xml .= '</item>';
        }

        $xml .= '</channel>';
        $xml .= '</rss>';

        return response($xml, 200, [
            'Content-Type' => 'application/rss+xml; charset=utf-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
