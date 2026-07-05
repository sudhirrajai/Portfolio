<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use App\Models\CaseStudyCategory;

class CaseStudyController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CaseStudies/Index', [
            'caseStudies' => CaseStudy::with('categories')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CaseStudies/Form', [
            'categories' => CaseStudyCategory::orderBy('name', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
        }

        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_filter($tags)]);
        }

        if (is_string($request->category_ids)) {
            $request->merge(['category_ids' => json_decode($request->category_ids, true)]);
        }

        $request->merge([
            'is_published' => filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN)
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client' => 'nullable|string|max:255',
            'year' => 'required|string|max:4',
            'summary' => 'required|string',
            'content' => 'required|string',
            'stack' => 'required|array',
            'tags' => 'nullable|array',
            'color' => 'required|string',
            'is_published' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:case_study_categories,id',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('case_studies', 'public');
        }
        unset($validated['image']);

        $baseSlug = Str::slug($validated['title']);
        $slugCount = CaseStudy::where('slug', 'like', "$baseSlug%")->count();
        $validated['slug'] = $slugCount ? "{$baseSlug}-{$slugCount}" : $baseSlug;

        $caseStudy = CaseStudy::create($validated);
        $caseStudy->categories()->sync($request->input('category_ids', []));

        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study created successfully.');
    }

    public function edit(CaseStudy $caseStudy)
    {
        return Inertia::render('Admin/CaseStudies/Form', [
            'caseStudy' => $caseStudy->load('categories'),
            'categories' => CaseStudyCategory::orderBy('name', 'asc')->get()
        ]);
    }

    public function update(Request $request, CaseStudy $caseStudy)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
        }

        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_filter($tags)]);
        }

        if (is_string($request->category_ids)) {
            $request->merge(['category_ids' => json_decode($request->category_ids, true)]);
        }

        $request->merge([
            'is_published' => filter_var($request->input('is_published', true), FILTER_VALIDATE_BOOLEAN)
        ]);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'client' => 'nullable|string|max:255',
            'year' => 'required|string|max:4',
            'summary' => 'required|string',
            'content' => 'required|string',
            'stack' => 'required|array',
            'tags' => 'nullable|array',
            'color' => 'required|string',
            'is_published' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:case_study_categories,id',
        ]);

        if ($request->hasFile('image')) {
            if ($caseStudy->image_path) {
                Storage::disk('public')->delete($caseStudy->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('case_studies', 'public');
        }
        unset($validated['image']);

        $baseSlug = Str::slug($validated['title']);
        $slugCount = CaseStudy::where('slug', 'like', "$baseSlug%")->where('id', '!=', $caseStudy->id)->count();
        $validated['slug'] = $slugCount ? "{$baseSlug}-{$slugCount}" : $baseSlug;

        $caseStudy->update($validated);
        $caseStudy->categories()->sync($request->input('category_ids', []));

        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study updated successfully.');
    }

    public function destroy(CaseStudy $caseStudy)
    {
        if ($caseStudy->image_path) {
            Storage::disk('public')->delete($caseStudy->image_path);
        }
        $caseStudy->categories()->detach();
        $caseStudy->delete();
        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study deleted successfully.');
    }
}
