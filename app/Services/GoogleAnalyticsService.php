<?php

namespace App\Services;

use Google\Analytics\Data\V1beta\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;
use Google\Analytics\Data\V1beta\OrderBy;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class GoogleAnalyticsService
{
    protected ?BetaAnalyticsDataClient $client = null;

    public function __construct(string $credentialsJson)
    {
        try {
            $credentials = json_decode($credentialsJson, true);
            if (is_array($credentials)) {
                $this->client = new BetaAnalyticsDataClient([
                    'credentials' => $credentials
                ]);
            }
        } catch (Exception $e) {
            Log::error('Google Analytics API Client initialization failed: ' . $e->getMessage());
        }
    }

    public function isConnected(): bool
    {
        return $this->client !== null;
    }

    public function getOverviewStats(string $propertyId): array
    {
        if (!$this->client) {
            return [];
        }

        try {
            // Fetch total views and unique active users for last 30 days
            $response = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'metrics' => [
                    new Metric(['name' => 'screenPageViews']),
                    new Metric(['name' => 'activeUsers']),
                ],
            ]);

            // Fetch today's views and uniques
            $todayResponse = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => 'today',
                        'end_date' => 'today',
                    ]),
                ],
                'metrics' => [
                    new Metric(['name' => 'screenPageViews']),
                    new Metric(['name' => 'activeUsers']),
                ],
            ]);

            $totalViews = 0;
            $uniqueUsers = 0;
            $todayViews = 0;
            $todayUniques = 0;

            if ($response->getRows()->count() > 0) {
                $row = $response->getRows()[0];
                $totalViews = (int)$row->getMetricValues()[0]->getValue();
                $uniqueUsers = (int)$row->getMetricValues()[1]->getValue();
            }

            if ($todayResponse->getRows()->count() > 0) {
                $row = $todayResponse->getRows()[0];
                $todayViews = (int)$row->getMetricValues()[0]->getValue();
                $todayUniques = (int)$row->getMetricValues()[1]->getValue();
            }

            return [
                'total_views' => $totalViews,
                'unique_visitors' => $uniqueUsers,
                'today_views' => $todayViews,
                'today_uniques' => $todayUniques,
            ];
        } catch (Exception $e) {
            Log::error('Google Analytics API getOverviewStats failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getDailyTraffic(string $propertyId): array
    {
        if (!$this->client) {
            return [];
        }

        try {
            // Run report for the last 14 days
            $response = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '14daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [
                    new Dimension(['name' => 'date']),
                ],
                'metrics' => [
                    new Metric(['name' => 'screenPageViews']),
                    new Metric(['name' => 'activeUsers']),
                ],
                'orderBys' => [
                    new OrderBy([
                        'dimension' => new OrderBy\DimensionOrderBy([
                            'dimension_name' => 'date',
                            'order_type' => OrderBy\DimensionOrderBy\OrderType::ALPHANUMERIC
                        ])
                    ])
                ]
            ]);

            $chartData = [];
            foreach ($response->getRows() as $row) {
                $rawDate = $row->getDimensionValues()[0]->getValue(); // e.g. "20260628"
                
                // Format label: "Jun 28"
                $formattedDate = Carbon::createFromFormat('Ymd', $rawDate)->format('D, M j');
                
                $views = (int)$row->getMetricValues()[0]->getValue();
                $uniques = (int)$row->getMetricValues()[1]->getValue();

                $chartData[] = [
                    'date_label' => $formattedDate,
                    'views' => $views,
                    'uniques' => $uniques,
                ];
            }

            return $chartData;
        } catch (Exception $e) {
            Log::error('Google Analytics API getDailyTraffic failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getTopPages(string $propertyId): array
    {
        if (!$this->client) {
            return [];
        }

        try {
            $response = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [
                    new Dimension(['name' => 'pagePath']),
                ],
                'metrics' => [
                    new Metric(['name' => 'screenPageViews']),
                ],
                'limit' => 5,
            ]);

            $pages = [];
            foreach ($response->getRows() as $row) {
                $pages[] = [
                    'url_path' => $row->getDimensionValues()[0]->getValue(),
                    'total_views' => (int)$row->getMetricValues()[0]->getValue(),
                ];
            }
            return $pages;
        } catch (Exception $e) {
            Log::error('Google Analytics API getTopPages failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getTopReferrers(string $propertyId): array
    {
        if (!$this->client) {
            return [];
        }

        try {
            $response = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [
                    new Dimension(['name' => 'sessionSource']),
                ],
                'metrics' => [
                    new Metric(['name' => 'sessions']),
                ],
                'limit' => 5,
            ]);

            $referrers = [];
            foreach ($response->getRows() as $row) {
                $referrers[] = [
                    'referer' => $row->getDimensionValues()[0]->getValue(),
                    'occurrences' => (int)$row->getMetricValues()[0]->getValue(),
                ];
            }
            return $referrers;
        } catch (Exception $e) {
            Log::error('Google Analytics API getTopReferrers failed: ' . $e->getMessage());
            return [];
        }
    }

    public function getDeviceAndOSBreakdown(string $propertyId): array
    {
        if (!$this->client) {
            return ['browsers' => [], 'platforms' => []];
        }

        try {
            // Fetch Browsers
            $browserResponse = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [
                    new Dimension(['name' => 'browser']),
                ],
                'metrics' => [
                    new Metric(['name' => 'sessions']),
                ],
                'limit' => 5,
            ]);

            // Fetch OS Platforms
            $osResponse = $this->client->runReport([
                'property' => 'properties/' . $propertyId,
                'dateRanges' => [
                    new DateRange([
                        'start_date' => '30daysAgo',
                        'end_date' => 'today',
                    ]),
                ],
                'dimensions' => [
                    new Dimension(['name' => 'operatingSystem']),
                ],
                'metrics' => [
                    new Metric(['name' => 'sessions']),
                ],
                'limit' => 5,
            ]);

            $browsers = [];
            foreach ($browserResponse->getRows() as $row) {
                $browsers[] = [
                    'browser' => $row->getDimensionValues()[0]->getValue(),
                    'count' => (int)$row->getMetricValues()[0]->getValue(),
                ];
            }

            $platforms = [];
            foreach ($osResponse->getRows() as $row) {
                $platforms[] = [
                    'platform' => $row->getDimensionValues()[0]->getValue(),
                    'count' => (int)$row->getMetricValues()[0]->getValue(),
                ];
            }

            return [
                'browsers' => $browsers,
                'platforms' => $platforms,
            ];
        } catch (Exception $e) {
            Log::error('Google Analytics API getDeviceAndOSBreakdown failed: ' . $e->getMessage());
            return ['browsers' => [], 'platforms' => []];
        }
    }
}
