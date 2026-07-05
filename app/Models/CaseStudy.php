<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudy extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'client',
        'year',
        'summary',
        'content',
        'stack',
        'tags',
        'color',
        'image_path',
        'is_published'
    ];

    protected $casts = [
        'stack' => 'array',
        'tags' => 'array',
        'is_published' => 'boolean'
    ];

    public function categories()
    {
        return $this->belongsToMany(
            CaseStudyCategory::class,
            'case_study_category_relation',
            'case_study_id',
            'category_id'
        );
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
