<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Projects/Form');
    }

    public function store(Request $request)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
        }

        if (is_string($request->highlights)) {
            // Highlights are split by line break
            $highlights = array_map('trim', explode("\n", $request->highlights));
            $request->merge(['highlights' => array_filter($highlights)]);
        }

        $request->merge([
            'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)
        ]);

        $validated = $request->validate([
            'is_featured' => 'nullable|boolean',
            'title' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'summary' => 'required|string',
            'stack' => 'required|array',
            'highlights' => 'required|array',
            'color' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('projects', 'public');
        }
        unset($validated['image']);

        $baseSlug = Str::slug($validated['title']);
        $slugCount = Project::where('slug', 'like', "$baseSlug%")->count();
        $validated['slug'] = $slugCount ? "{$baseSlug}-{$slugCount}" : $baseSlug;

        Project::create($validated);

        return redirect()->route('admin.projects.index')->with('success', 'Project created successfully.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Admin/Projects/Form', [
            'project' => $project
        ]);
    }

    public function update(Request $request, Project $project)
    {
        if (is_string($request->stack)) {
            $stack = array_map('trim', explode(',', $request->stack));
            $request->merge(['stack' => array_filter($stack)]);
        }

        if (is_string($request->highlights)) {
            $highlights = array_map('trim', explode("\n", $request->highlights));
            $request->merge(['highlights' => array_filter($highlights)]);
        }

        $request->merge([
            'is_featured' => filter_var($request->input('is_featured'), FILTER_VALIDATE_BOOLEAN)
        ]);

        $validated = $request->validate([
            'is_featured' => 'nullable|boolean',
            'title' => 'required|string|max:255',
            'year' => 'required|string|max:4',
            'summary' => 'required|string',
            'stack' => 'required|array',
            'highlights' => 'required|array',
            'color' => 'required|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('projects', 'public');
        }
        unset($validated['image']);

        $baseSlug = Str::slug($validated['title']);
        $slugCount = Project::where('slug', 'like', "$baseSlug%")->where('id', '!=', $project->id)->count();
        $validated['slug'] = $slugCount ? "{$baseSlug}-{$slugCount}" : $baseSlug;

        $project->update($validated);

        return redirect()->route('admin.projects.index')->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }
        $project->delete();
        return redirect()->route('admin.projects.index')->with('success', 'Project deleted successfully.');
    }
}
