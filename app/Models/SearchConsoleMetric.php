<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchConsoleMetric extends Model
{
    protected $fillable = [
        'page_url',
        'query',
        'date',
        'clicks',
        'impressions',
        'ctr',
        'position',
        'device',
        'country',
    ];

    protected $casts = [
        'date' => 'date',
        'clicks' => 'integer',
        'impressions' => 'integer',
        'ctr' => 'float',
        'position' => 'float',
    ];
}

