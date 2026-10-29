<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Google Search Console Metrics (Daily search ranking performance)
        Schema::create('search_console_metrics', function (Blueprint $table) {
            $table->id();
            $table->string('page_url', 500);
            $table->string('query', 255);
            $table->date('date')->index();
            $table->unsignedInteger('clicks')->default(0);
            $table->unsignedInteger('impressions')->default(0);
            $table->decimal('ctr', 8, 4)->default(0);
            $table->decimal('position', 8, 2)->default(0);
            $table->string('device', 50)->nullable();
            $table->string('country', 10)->nullable();
            $table->timestamps();

            $table->index(['page_url', 'date']);
            $table->index(['query', 'date']);
        });

        // 2. Google Search Console URL Inspections (Indexation status & crawl errors)
        Schema::create('search_console_url_inspections', function (Blueprint $table) {
            $table->id();
            $table->string('url', 500)->unique();
            $table->string('verdict', 50)->default('NEUTRAL'); // PASS, FAIL, NEUTRAL
            $table->string('coverage_state', 255)->nullable();
            $table->string('robots_txt_state', 100)->nullable();
            $table->string('indexing_state', 100)->nullable();
            $table->string('page_fetch_state', 100)->nullable();
            $table->string('google_canonical', 500)->nullable();
            $table->string('user_canonical', 500)->nullable();
            $table->timestamp('last_crawl_time')->nullable();
            $table->json('issues')->nullable();
            $table->timestamp('inspected_at')->nullable();
            $table->timestamps();
        });

        // 3. Automated 301 Redirect Rules (Self-healing & URL fix engine)
        Schema::create('seo_redirects', function (Blueprint $table) {
            $table->id();
            $table->string('source_path', 500)->index();
            $table->string('target_path', 500);
            $table->unsignedSmallInteger('status_code')->default(301);
            $table->unsignedBigInteger('hits')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_hit_at')->nullable();
            $table->string('notes', 255)->nullable();
            $table->timestamps();
        });

        // 4. Automated SEO Health Issues (Internal crawler findings)
        Schema::create('seo_health_issues', function (Blueprint $table) {
            $table->id();
            $table->string('url', 500);
            $table->string('issue_type', 100); // 404_error, slow_response, missing_meta_description, missing_og_image, broken_link
            $table->enum('severity', ['critical', 'warning', 'notice'])->default('warning');
            $table->integer('status_code')->nullable();
            $table->json('details')->nullable();
            $table->boolean('is_resolved')->default(false);
            $table->timestamp('detected_at')->useCurrent();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['is_resolved', 'severity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seo_health_issues');
        Schema::dropIfExists('seo_redirects');
        Schema::dropIfExists('search_console_url_inspections');
        Schema::dropIfExists('search_console_metrics');
    }
};
