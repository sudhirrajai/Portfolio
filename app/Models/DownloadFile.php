<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Str;

class DownloadFile extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'title',
        'description',
        'original_filename',
        'file_path',
        'mime_type',
        'size_bytes',
        'is_public',
        'views_count',
        'downloads_count'
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'size_bytes' => 'integer',
        'views_count' => 'integer',
        'downloads_count' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid();
            }
        });
    }
}
