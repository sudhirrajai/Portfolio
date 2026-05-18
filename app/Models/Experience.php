<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = ['company', 'role', 'period', 'bullets'];

    protected $casts = [
        'bullets' => 'array',
    ];
    //
}
