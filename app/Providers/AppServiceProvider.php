<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;
use App\Models\SmtpSetting;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Dynamically inject administrator SMTP configs at runtime
        try {
            if (Schema::hasTable('smtp_settings')) {
                $smtp = SmtpSetting::first();
                if ($smtp && !empty($smtp->host)) {
                    config([
                        'mail.default' => 'smtp',
                        'mail.mailers.smtp.host' => $smtp->host,
                        'mail.mailers.smtp.port' => (int)$smtp->port,
                        'mail.mailers.smtp.username' => $smtp->username,
                        'mail.mailers.smtp.password' => $smtp->password,
                        'mail.mailers.smtp.encryption' => $smtp->encryption,
                        'mail.from.address' => $smtp->from_address,
                        'mail.from.name' => $smtp->from_name,
                    ]);
                }
            }
        } catch (\Exception $e) {
            // Silently ignore failure during setup operations
        }

        // Dynamically inject administrator Google API credentials at runtime
        try {
            if (Schema::hasTable('booking_settings')) {
                $settings = \App\Models\BookingSetting::first();
                if ($settings) {
                    if (!empty($settings->google_client_id)) {
                        config(['services.google.client_id' => $settings->google_client_id]);
                    }
                    if (!empty($settings->google_client_secret)) {
                        config(['services.google.client_secret' => $settings->google_client_secret]);
                    }
                }
            }
        } catch (\Exception $e) {
            // Silently ignore failure during setup operations
        }
    }
}
