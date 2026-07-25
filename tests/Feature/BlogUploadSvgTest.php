<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\BlogPost;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BlogUploadSvgTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_blog_with_svg_image(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/></svg>';
        $svgFile = UploadedFile::fake()->createWithContent('banner.svg', $svgContent);

        $response = $this
            ->actingAs($user)
            ->post(route('admin.blogs.store'), [
                'title' => 'Test Blog with SVG',
                'date' => 'Jul 25, 2026',
                'read_time' => '5 min read',
                'color' => '#6366f1',
                'excerpt' => 'An excerpt test with SVG banner.',
                'content' => '<p>Blog body content...</p>',
                'tags' => ['Laravel', 'SVG'],
                'image' => $svgFile,
            ]);

        $response->assertRedirect(route('admin.blogs.index'));

        $blog = BlogPost::first();
        $this->assertNotNull($blog);
        $this->assertEquals('Test Blog with SVG', $blog->title);
        $this->assertNotNull($blog->image_path);
        Storage::disk('public')->assertExists($blog->image_path);
    }
}
