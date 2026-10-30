<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSearchConsoleService;
use App\Models\BlogPost;
use App\Models\CaseStudy;

class SyncSearchConsoleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'seo:sync-gsc {--days=30 : Number of past days to sync} {--inspect : Also run URL inspections for all blog posts and case studies}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync ranking keywords, clicks, impressions and inspect URL errors from Google Search Console';

    /**
     * Execute the console command.
     */
    public function handle(GoogleSearchConsoleService $gsc): int
    {
        $this->info('Starting Google Search Console sync...');

        if (!$gsc->isConnected()) {
            $this->error('Search Console is not connected or credentials are missing.');
            return self::FAILURE;
        }

        $siteUrl = $gsc->getSiteUrl();
        $this->info("Connected site: {$siteUrl}");

        $days = (int) $this->option('days');
        $this->info("Fetching Search Analytics for the past {$days} days...");

        $synced = $gsc->syncSearchAnalytics($days);
        $this->info("Successfully synced {$synced} query/page metrics from Google Search Console.");

        // Automatically ping Google Search Console with sitemap
        $this->info("Submitting sitemap.xml to Google Search Console...");
        if ($gsc->submitSitemap()) {
            $this->info("Sitemap successfully updated in Google Search Console.");
        }

        if ($this->option('inspect')) {
            $this->info('Running URL inspection on all blog posts & case studies...');

            $urls = [
                $siteUrl,
                rtrim($siteUrl, '/') . '/blog',
                rtrim($siteUrl, '/') . '/about',
                rtrim($siteUrl, '/') . '/case-studies',
            ];

            foreach (BlogPost::all() as $post) {
                $urls[] = rtrim($siteUrl, '/') . "/blog/{$post->slug}";
            }

            foreach (CaseStudy::where('is_published', true)->get() as $cs) {
                $urls[] = rtrim($siteUrl, '/') . "/case-studies/{$cs->slug}";
            }

            $bar = $this->output->createProgressBar(count($urls));
            $bar->start();

            foreach ($urls as $url) {
                $result = $gsc->inspectUrl($url);
                $bar->advance();
                usleep(250000); // 250ms delay between inspections to respect Google API quotas
            }

            $bar->finish();
            $this->newLine();
            $this->info('URL Inspections complete and stored in database.');
        }

        return self::SUCCESS;
    }
}

