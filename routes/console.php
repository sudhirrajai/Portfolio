<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Automated Google Search Console sync every day at 4 AM
Schedule::command('seo:sync-gsc --inspect')
    ->dailyAt('04:00')
    ->withoutOverlapping();

// Automated SEO Health Check every Monday at 5 AM
Schedule::command('seo:health-check')
    ->weeklyOn(1, '05:00')
    ->withoutOverlapping();

