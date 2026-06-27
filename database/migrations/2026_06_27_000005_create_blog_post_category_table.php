<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create pivot table
        Schema::create('blog_post_category', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_post_id')->constrained('blog_posts')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('blog_categories')->cascadeOnDelete();
            $table->unique(['blog_post_id', 'category_id']);
            $table->timestamps();
        });

        // 2. Migrate existing category_id relations to the new pivot table
        if (Schema::hasColumn('blog_posts', 'category_id')) {
            $posts = DB::table('blog_posts')->whereNotNull('category_id')->get();
            foreach ($posts as $post) {
                DB::table('blog_post_category')->insert([
                    'blog_post_id' => $post->id,
                    'category_id' => $post->category_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            // 3. Drop column and key on blog_posts
            Schema::table('blog_posts', function (Blueprint $table) {
                $table->dropForeign(['category_id']);
                $table->dropColumn('category_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. Add column back
        Schema::table('blog_posts', function (Blueprint $table) {
            $table->foreignId('category_id')
                ->nullable()
                ->after('id')
                ->constrained('blog_categories')
                ->nullOnDelete();
        });

        // 2. Restore relation data (setting single category from pivot)
        $relations = DB::table('blog_post_category')->orderBy('created_at', 'asc')->get();
        foreach ($relations as $rel) {
            DB::table('blog_posts')
                ->where('id', $rel->blog_post_id)
                ->whereNull('category_id')
                ->update(['category_id' => $rel->category_id]);
        }

        // 3. Drop pivot table
        Schema::dropIfExists('blog_post_category');
    }
};
