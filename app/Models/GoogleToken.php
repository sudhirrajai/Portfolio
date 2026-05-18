<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GoogleToken extends Model
{
    protected $fillable = [
        'account_email',
        'access_token',
        'refresh_token',
        'expires_in',
        'created_at_timestamp',
    ];

    protected $casts = [
        'created_at_timestamp' => 'integer',
        'expires_in' => 'integer',
    ];
}
