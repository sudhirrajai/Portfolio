<?php

namespace App\Services;

use App\Models\SeoSetting;
use App\Models\SearchConsoleMetric;
use App\Models\SearchConsoleUrlInspection;
use Google\Client as GoogleClient;
use Google\Service\SearchConsole;
use Google\Service\SearchConsole\SearchAnalyticsQueryRequest;
use Google\Service\SearchConsole\InspectUrlIndexRequest;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleSearchConsoleService
{
    protected ?GoogleClient $client = null;
    protected ?SearchConsole $searchConsole = null;
    protected ?string $siteUrl = null;

    public function __construct(?string $credentialsJson = null)
    {
        if (empty($credentialsJson)) {
            $globalSeo = SeoSetting::where('page_key', 'global')->first();
            $credentialsJson = $globalSeo?->google_analytics_credentials_json;
        }

        if (empty($credentialsJson)) {
            return;
        }

        try {
            $credentials = json_decode($credentialsJson, true);
            if (is_array($credentials)) {
                $client = new GoogleClient();
                $client->setAuthConfig($credentials);
                $client->addScope('https://www.googleapis.com/auth/webmasters');

                $this->client = $client;
                $this->searchConsole = new SearchConsole($client);
            }
        } catch (Exception $e) {
            Log::error('Google Search Console Client init failed: ' . $e->getMessage());
        }
    }

    public function isConnected(): bool
    {
        return $this->searchConsole !== null;
    }

    /**
     * Resolve the verified site URL in Google Search Console.
     */
    public function getSiteUrl(): ?string
    {
        if ($this->siteUrl) {
            return $this->siteUrl;
        }

        if (!$this->searchConsole) {
            return null;
        }

        try {
            $sites = $this->searchConsole->sites->listSites();
            $entries = $sites->getSiteEntry();

            if (!empty($entries)) {
                // Prefer matching current app host
                $appHost = parse_url(config('app.url'), PHP_URL_HOST);
                foreach ($entries as $entry) {
                    $url = $entry->getSiteUrl();
                    if ($appHost && str_contains($url, $appHost)) {
                        return $this->siteUrl = $url;
                    }
                }
                // Fallback to first site (e.g. https://sudhirrajai.com/)
                return $this->siteUrl = $entries[0]->getSiteUrl();
            }
        } catch (Exception $e) {
            Log::error('Failed to list Search Console sites: ' . $e->getMessage());
        }

        return $this->siteUrl = 'https://sudhirrajai.com/';
    }

    /**
     * Query and sync Search Console ranking & traffic analytics into local database.
     */
    public function syncSearchAnalytics(int $days = 30): int
    {
        if (!$this->isConnected()) {
            return 0;
        }

        $siteUrl = $this->getSiteUrl();
        if (!$siteUrl) {
            return 0;
        }

        $startDate = Carbon::now()->subDays($days)->format('Y-m-d');
        $endDate = Carbon::now()->subDays(1)->format('Y-m-d'); // GSC data has 2-3 day lag

        $request = new SearchAnalyticsQueryRequest();
        $request->setStartDate($startDate);
        $request->setEndDate($endDate);
        $request->setDimensions(['page', 'query', 'date']);
        $request->setRowLimit(5000);

        $syncedCount = 0;

        try {
            $response = $this->searchConsole->searchanalytics->query($siteUrl, $request);
            $rows = $response->getRows();

            if (empty($rows)) {
                return 0;
            }

            foreach ($rows as $row) {
                $keys = $row->getKeys();
                $pageUrl = $keys[0] ?? '';
                $query = $keys[1] ?? '';
                $date = $keys[2] ?? null;

                if (empty($pageUrl) || empty($query) || empty($date)) {
                    continue;
                }

                SearchConsoleMetric::updateOrCreate(
                    [
                        'page_url' => $pageUrl,
                        'query'    => $query,
                        'date'     => $date,
                    ],
                    [
                        'clicks'      => (int) $row->getClicks(),
                        'impressions' => (int) $row->getImpressions(),
                        'ctr'         => (float) $row->getCtr(),
                        'position'    => (float) $row->getPosition(),
                    ]
                );

                $syncedCount++;
            }
        } catch (Exception $e) {
            Log::error('Search Console syncSearchAnalytics failed: ' . $e->getMessage());
        }

        return $syncedCount;
    }

    /**
     * Inspect a specific URL live using Google Search Console URL Inspection API.
     */
    public function inspectUrl(string $url): ?array
    {
        if (!$this->isConnected()) {
            return null;
        }

        $siteUrl = $this->getSiteUrl();
        if (!$siteUrl) {
            return null;
        }

        // Ensure URL is absolute HTTPS matching siteUrl host
        if (!str_starts_with($url, 'http')) {
            $url = rtrim($siteUrl, '/') . '/' . ltrim($url, '/');
        }

        $inspectRequest = new InspectUrlIndexRequest();
        $inspectRequest->setSiteUrl($siteUrl);
        $inspectRequest->setInspectionUrl($url);

        try {
            $response = $this->searchConsole->urlInspection_index->inspect($inspectRequest);
            $result = $response->getInspectionResult();
            $indexStatus = $result->getIndexStatusResult();

            $data = [
                'url'               => $url,
                'verdict'           => $indexStatus->getVerdict() ?: 'NEUTRAL',
                'coverage_state'    => $indexStatus->getCoverageState(),
                'robots_txt_state'  => $indexStatus->getRobotsTxtState(),
                'indexing_state'    => $indexStatus->getIndexingState(),
                'page_fetch_state'  => $indexStatus->getPageFetchState(),
                'google_canonical'  => $indexStatus->getGoogleCanonical(),
                'user_canonical'    => $indexStatus->getUserCanonical(),
                'last_crawl_time'   => $indexStatus->getLastCrawlTime() ? Carbon::parse($indexStatus->getLastCrawlTime()) : null,
                'issues'            => [
                    'referring_urls' => $indexStatus->getReferringUrls() ?: [],
                    'crawled_as'     => $indexStatus->getCrawledAs(),
                ],
                'inspected_at'      => now(),
            ];

            SearchConsoleUrlInspection::updateOrCreate(
                ['url' => $url],
                $data
            );

            return $data;
        } catch (Exception $e) {
            Log::error("URL Inspection failed for {$url}: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Submit/Ping the XML Sitemap to Google Search Console for site-wide crawling.
     */
    public function submitSitemap(?string $sitemapUrl = null): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        $siteUrl = $this->getSiteUrl();
        if (!$siteUrl) {
            return false;
        }

        $sitemapUrl = $sitemapUrl ?: rtrim($siteUrl, '/') . '/sitemap.xml';

        try {
            $this->searchConsole->sitemaps->submit($siteUrl, $sitemapUrl);
            return true;
        } catch (Exception $e) {
            Log::error('Search Console submitSitemap failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get aggregate overview of Search Console performance.
     */
    public function getPerformanceOverview(): array
    {
        $totalClicks = SearchConsoleMetric::sum('clicks');
        $totalImpressions = SearchConsoleMetric::sum('impressions');
        $avgCtr = $totalImpressions > 0 ? ($totalClicks / $totalImpressions) * 100 : 0;
        $avgPosition = SearchConsoleMetric::avg('position') ?: 0;

        $topQueries = SearchConsoleMetric::selectRaw('query, sum(clicks) as total_clicks, sum(impressions) as total_impressions, avg(position) as avg_position')
            ->groupBy('query')
            ->orderByDesc('total_clicks')
            ->orderByDesc('total_impressions')
            ->limit(10)
            ->get();

        $topPages = SearchConsoleMetric::selectRaw('page_url, sum(clicks) as total_clicks, sum(impressions) as total_impressions, avg(position) as avg_position')
            ->groupBy('page_url')
            ->orderByDesc('total_clicks')
            ->orderByDesc('total_impressions')
            ->limit(10)
            ->get();

        $inspections = SearchConsoleUrlInspection::orderByDesc('inspected_at')->limit(20)->get();

        return [
            'total_clicks'      => (int) $totalClicks,
            'total_impressions' => (int) $totalImpressions,
            'avg_ctr'           => round($avgCtr, 2),
            'avg_position'      => round($avgPosition, 1),
            'top_queries'       => $topQueries,
            'top_pages'         => $topPages,
            'inspections'       => $inspections,
        ];
    }
}

