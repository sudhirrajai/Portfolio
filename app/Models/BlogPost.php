<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogPost extends Model
{
    protected $fillable = ['title', 'slug', 'date', 'read_time', 'color', 'image_path', 'excerpt', 'content', 'tags'];

    protected $casts = [
        'tags' => 'array',
    ];

    // Relationship: has many comments
    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }
}

