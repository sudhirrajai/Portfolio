<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotFoundTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a non-existent URL returns a 404 Inertia response with Error component.
     */
    public function test_non_existent_url_returns_404_inertia_response(): void
    {
        $response = $this->get('/non-existent-page-url');

        $response->assertStatus(404);
        
        // Assert that it renders the custom Inertia Error page
        $response->assertInertia(fn ($page) => 
            $page->component('Portfolio/Error')
                 ->where('status', 404)
        );
    }
}
