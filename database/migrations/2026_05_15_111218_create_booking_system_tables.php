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
        // Core Booking Log
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->dateTime('scheduled_at'); // Full timestamp of appointment
            $table->string('timezone')->default('UTC');
            $table->text('brief_notes')->nullable();
            $table->string('status')->default('confirmed'); // confirmed, cancelled
            
            // Google Meet Sync Metadata
            $table->string('google_event_id')->nullable();
            $table->string('google_meet_url')->nullable();
            $table->timestamps();
        });

        // Availability Configurations
        Schema::create('booking_settings', function (Blueprint $table) {
            $table->id();
            $table->json('days_of_week'); // e.g., ["monday", "tuesday", "wednesday", "thursday", "friday"]
            $table->time('work_hours_start')->default('09:00:00');
            $table->time('work_hours_end')->default('17:00:00');
            $table->integer('slot_duration')->default(30); // duration in minutes
            $table->timestamps();
        });

        // Google API Integration Access Storage
        Schema::create('google_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('account_email')->nullable();
            $table->text('access_token');
            $table->text('refresh_token')->nullable();
            $table->integer('expires_in');
            $table->bigInteger('created_at_timestamp'); // original Google response epoch
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('booking_settings');
        Schema::dropIfExists('google_tokens');
    }
};
