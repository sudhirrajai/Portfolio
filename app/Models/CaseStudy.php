<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'client',
        'year',
        'summary',
        'content',
        'stack',
        'color',
        'image_path',
        'is_published'
    ];

    protected $casts = [
        'stack' => 'array',
        'is_published' => 'boolean'
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
