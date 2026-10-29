<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoRedirect extends Model
{
    protected $fillable = [
        'source_path',
        'target_path',
        'status_code',
        'hits',
        'is_active',
        'last_hit_at',
        'notes',
    ];

    protected $casts = [
        'status_code' => 'integer',
        'hits' => 'integer',
        'is_active' => 'boolean',
        'last_hit_at' => 'datetime',
    ];

    public function recordHit(): void
    {
        $this->increment('hits');
        $this->update(['last_hit_at' => now()]);
    }
}

