<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoSetting extends Model
{
    protected $fillable = [
        'page_key',
        'page_title',
        'meta_description',
        'meta_keywords',
        'google_analytics_id',
        'google_search_console_id',
        'custom_meta_tags',
        'google_analytics_property_id',
        'google_analytics_credentials_json'
    ];
}
