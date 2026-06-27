<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogPost extends Model
{
    protected $fillable = ['category_id', 'title', 'slug', 'date', 'read_time', 'color', 'image_path', 'excerpt', 'content', 'tags'];

    protected $casts = [
        'tags' => 'array',
    ];

    // Relationship: has many comments
    public function comments(): HasMany
    {
        return $this->hasMany(BlogComment::class);
    }

    /**
     * Relationship: A blog post belongs to a category.
     */
    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}


