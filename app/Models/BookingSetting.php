<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingSetting extends Model
{
    protected $fillable = [
        'is_active',
        'days_of_week',
        'work_hours_start',
        'work_hours_end',
        'slot_duration',
        'google_client_id',
        'google_client_secret',
    ];

    protected $casts = [
        'days_of_week' => 'array',
        'is_active' => 'boolean',
    ];
}
