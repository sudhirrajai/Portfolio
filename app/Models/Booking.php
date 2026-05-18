<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'name',
        'email',
        'scheduled_at',
        'timezone',
        'brief_notes',
        'status',
        'google_event_id',
        'google_meet_url',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
    ];
}
