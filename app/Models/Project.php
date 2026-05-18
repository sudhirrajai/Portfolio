<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'is_featured', 'is_open_source', 'github_url', 'open_source_content',
        'title', 'slug', 'year', 'summary', 'stack', 'highlights', 'color', 'image_path'
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_open_source' => 'boolean',
        'stack' => 'array',
        'highlights' => 'array',
    ];


    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
