<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Roadmap extends Model
{
    protected $fillable = ['phase', 'title', 'description', 'tags', 'order_weight'];

    protected $casts = [
        'tags' => 'array',
    ];
}
