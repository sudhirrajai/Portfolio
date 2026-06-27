<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'meta_title',
        'meta_description',
    ];

    /**
     * Relationship: A category belongs to many blog posts.
     */
    public function posts()
    {
        return $this->belongsToMany(BlogPost::class, 'blog_post_category', 'category_id', 'blog_post_id');
    }
}
