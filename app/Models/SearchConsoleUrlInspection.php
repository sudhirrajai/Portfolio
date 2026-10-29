<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchConsoleUrlInspection extends Model
{
    protected $fillable = [
        'url',
        'verdict',
        'coverage_state',
        'robots_txt_state',
        'indexing_state',
        'page_fetch_state',
        'google_canonical',
        'user_canonical',
        'last_crawl_time',
        'issues',
        'inspected_at',
    ];

    protected $casts = [
        'issues' => 'array',
        'last_crawl_time' => 'datetime',
        'inspected_at' => 'datetime',
    ];
}

