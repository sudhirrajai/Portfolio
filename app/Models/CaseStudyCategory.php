<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CaseStudyCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description'
    ];

    public function caseStudies()
    {
        return $this->belongsToMany(
            CaseStudy::class, 
            'case_study_category_relation', 
            'category_id', 
            'case_study_id'
        );
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
