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

    /**
     * Relationship: A blog post belongs to many categories.
     */
    public function categories()
    {
        return $this->belongsToMany(BlogCategory::class, 'blog_post_category', 'blog_post_id', 'category_id');
    }
}



