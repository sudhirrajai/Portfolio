<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = ['title', 'slug', 'date', 'read_time', 'color', 'image_path', 'excerpt', 'content', 'tags'];

    protected $casts = [
        'tags' => 'array',
    ];
    //
}
