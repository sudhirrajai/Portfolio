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
        // 1. Add tags to case_studies table
        Schema::table('case_studies', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('stack');
        });

        // 2. Create case_study_categories table
        Schema::create('case_study_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 3. Create pivot table for case study categories
        Schema::create('case_study_category_relation', function (Blueprint $table) {
            $table->foreignId('case_study_id')->constrained('case_studies')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('case_study_categories')->cascadeOnDelete();
            $table->primary(['case_study_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_study_category_relation');
        Schema::dropIfExists('case_study_categories');
        Schema::table('case_studies', function (Blueprint $table) {
            $table->dropColumn('tags');
        });
    }
};
