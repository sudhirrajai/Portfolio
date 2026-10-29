<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeoHealthIssue extends Model
{
    protected $fillable = [
        'url',
        'issue_type',
        'severity',
        'status_code',
        'details',
        'is_resolved',
        'detected_at',
        'resolved_at',
    ];

    protected $casts = [
        'details' => 'array',
        'is_resolved' => 'boolean',
        'detected_at' => 'datetime',
        'resolved_at' => 'datetime',
    ];

    public function markResolved(): void
    {
        $this->update([
            'is_resolved' => true,
            'resolved_at' => now(),
        ]);
    }
}

