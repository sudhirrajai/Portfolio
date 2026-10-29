<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BlogPost;
use App\Models\SeoRedirect;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SeoAutomationTest extends TestCase
{
    use RefreshDatabase;

    public function test_seo_health_check_command_executes_successfully(): void
    {
        $this->artisan('seo:health-check')
            ->assertExitCode(0);
    }

    public function test_self_healing_redirect_catches_broken_slug_with_301(): void
    {
        $post = BlogPost::create([
            'title'     => 'How I Cut Laravel API Response Times from 800ms to Under 400ms',
            'slug'      => 'how-i-cut-laravel-api-response-times-from-800ms-to-under-400ms',
            'excerpt'   => 'Performance tips',
            'content'   => '<p>Hello world</p>',
            'date'      => 'Jun 26, 2026',
            'read_time' => '5 min',
            'color'     => '#6366f1',
            'tags'      => ['laravel'],
        ]);

        // Partial broken slug
        $response = $this->get('/blog/how-i-cut-laravel-api');

        $response->assertStatus(301);
        $response->assertRedirect("/blog/{$post->slug}");

        $this->assertDatabaseHas('seo_redirects', [
            'target_path' => "/blog/{$post->slug}",
            'status_code' => 301,
        ]);
    }

    public function test_sitemap_outputs_valid_xml_with_image_namespace(): void
    {
        $response = $this->get('/sitemap.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $this->assertStringContainsString('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"', $response->getContent());
    }

    public function test_admin_seo_page_is_accessible_to_authenticated_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/admin/seo');
        $response->assertStatus(200);
    }

    public function test_admin_can_manually_trigger_health_check_action(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/admin/seo/health-check');
        $response->assertStatus(302);
        $response->assertSessionHas('console_output');
    }
}
