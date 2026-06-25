<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BlogComment extends Model
{
    protected $fillable = [
        'blog_post_id',
        'parent_id',
        'name',
        'email',
        'body',
        'status',
        'is_author',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'is_author' => 'boolean',
    ];

    // Relationship: belongs to a blog post
    public function blogPost(): BelongsTo
    {
        return $this->belongsTo(BlogPost::class);
    }

    // Relationship: belongs to a parent comment (for threading)
    public function parent(): BelongsTo
    {
        return $this->belongsTo(BlogComment::class, 'parent_id');
    }

    // Relationship: has many replies
    public function replies(): HasMany
    {
        return $this->hasMany(BlogComment::class, 'parent_id')->where('status', 'approved')->orderBy('created_at', 'asc');
    }

    // Scope: only approved comments
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // Scope: only root-level comments (no parent)
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }
}
