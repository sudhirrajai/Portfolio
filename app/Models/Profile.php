<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'name', 'role', 'tagline', 'summary', 'email', 'phone', 'location', 
        'social_links', 'is_available', 'working_hours_start', 'working_hours_end'
    ];

    protected $casts = [
        'social_links' => 'array',
        'is_available' => 'boolean',
    ];
}
