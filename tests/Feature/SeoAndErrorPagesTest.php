<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoAndErrorPagesTest extends TestCase
{
    use RefreshDatabase;

    public function test_llms_txt_endpoint_returns_valid_text(): void
    {
        $response = $this->get('/llms.txt');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/plain; charset=utf-8');
        $response->assertSee('Core Navigation');
    }

    public function test_llms_full_txt_endpoint_returns_valid_text(): void
    {
        $response = $this->get('/llms-full.txt');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/plain; charset=utf-8');
        $response->assertSee('Complete LLM Knowledge Base');
    }

    public function test_feed_xml_endpoint_returns_valid_rss(): void
    {
        $response = $this->get('/feed.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/rss+xml; charset=utf-8');
        $response->assertSee('<rss version="2.0"', false);
    }

    public function test_sitemap_xml_includes_llms_and_feed(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $response->assertSee('/llms.txt');
        $response->assertSee('/feed.xml');
    }

    public function test_robots_txt_includes_ai_bots_and_llms_txt(): void
    {
        $response = $this->get('/robots.txt');

        $response->assertStatus(200);
        $response->assertSee('GPTBot');
        $response->assertSee('PerplexityBot');
        $response->assertSee('LLMs-Txt:');
        $response->assertSee('Sitemap:');
    }

    public function test_non_existent_url_returns_404_custom_error_page(): void
    {
        $response = $this->get('/random-missing-url-123');

        $response->assertStatus(404);
        $response->assertInertia(fn ($page) => 
            $page->component('Portfolio/Error')
                 ->where('status', 404)
        );
    }
}
