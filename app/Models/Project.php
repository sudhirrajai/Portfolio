<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['is_featured', 'title', 'slug', 'year', 'summary', 'stack', 'highlights', 'color', 'image_path'];

    protected $casts = [
        'is_featured' => 'boolean',
        'stack' => 'array',
        'highlights' => 'array',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
