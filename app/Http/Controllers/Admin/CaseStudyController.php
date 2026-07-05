<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CaseStudy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CaseStudyController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CaseStudies/Index', [
            'caseStudies' => CaseStudy::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CaseStudies/Form');
    }

    public function store(Request $request)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
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
            'color' => 'required|string',
            'is_published' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('case_studies', 'public');
        }
        unset($validated['image']);

        $baseSlug = Str::slug($validated['title']);
        $slugCount = CaseStudy::where('slug', 'like', "$baseSlug%")->count();
        $validated['slug'] = $slugCount ? "{$baseSlug}-{$slugCount}" : $baseSlug;

        CaseStudy::create($validated);

        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study created successfully.');
    }

    public function edit(CaseStudy $caseStudy)
    {
        return Inertia::render('Admin/CaseStudies/Form', [
            'caseStudy' => $caseStudy
        ]);
    }

    public function update(Request $request, CaseStudy $caseStudy)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
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
            'color' => 'required|string',
            'is_published' => 'required|boolean',
            'image' => 'nullable|image|max:2048',
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

        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study updated successfully.');
    }

    public function destroy(CaseStudy $caseStudy)
    {
        if ($caseStudy->image_path) {
            Storage::disk('public')->delete($caseStudy->image_path);
        }
        $caseStudy->delete();
        return redirect()->route('admin.case-studies.index')->with('success', 'Case Study deleted successfully.');
    }
}
