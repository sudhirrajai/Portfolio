<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudyCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CaseStudyCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CaseStudies/Categories/Index', [
            'categories' => CaseStudyCategory::withCount('caseStudies')->orderBy('name', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:case_study_categories,name',
            'slug' => 'nullable|string|max:255|unique:case_study_categories,slug',
            'description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        // Double check slug uniqueness
        $count = 1;
        $originalSlug = $validated['slug'];
        while (CaseStudyCategory::where('slug', $validated['slug'])->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count;
            $count++;
        }

        CaseStudyCategory::create($validated);

        return redirect()->route('admin.case-study-categories.index')->with('success', 'Category created successfully.');
    }

    public function update(Request $request, CaseStudyCategory $caseStudyCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:case_study_categories,name,' . $caseStudyCategory->id,
            'slug' => 'nullable|string|max:255|unique:case_study_categories,slug,' . $caseStudyCategory->id,
            'description' => 'nullable|string',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }

        $count = 1;
        $originalSlug = $validated['slug'];
        while (CaseStudyCategory::where('slug', $validated['slug'])->where('id', '!=', $caseStudyCategory->id)->exists()) {
            $validated['slug'] = $originalSlug . '-' . $count;
            $count++;
        }

        $caseStudyCategory->update($validated);

        return redirect()->route('admin.case-study-categories.index')->with('success', 'Category updated successfully.');
    }

    public function destroy(CaseStudyCategory $caseStudyCategory)
    {
        $caseStudyCategory->delete();
        return redirect()->route('admin.case-study-categories.index')->with('success', 'Category deleted successfully.');
    }
}
