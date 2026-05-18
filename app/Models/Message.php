<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['name', 'email', 'message', 'read_at'];
    
    protected $casts = [
        'read_at' => 'datetime'
    ];
}
