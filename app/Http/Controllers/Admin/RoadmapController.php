<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Roadmap;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoadmapController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Roadmaps/Index', [
            'roadmaps' => Roadmap::orderBy('order_weight', 'asc')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Roadmaps/Form');
    }

    public function store(Request $request)
    {
        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_values(array_filter($tags))]);
        }

        $validated = $request->validate([
            'phase' => 'required|string|in:Past,Now,Next,Future',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'order_weight' => 'nullable|integer',
        ]);

        Roadmap::create($validated);

        return redirect()->route('admin.roadmaps.index')->with('success', 'Roadmap item created successfully.');
    }

    public function edit(Roadmap $roadmap)
    {
        return Inertia::render('Admin/Roadmaps/Form', [
            'roadmap' => $roadmap
        ]);
    }

    public function update(Request $request, Roadmap $roadmap)
    {
        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_values(array_filter($tags))]);
        }

        $validated = $request->validate([
            'phase' => 'required|string|in:Past,Now,Next,Future',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'tags' => 'nullable|array',
            'order_weight' => 'nullable|integer',
        ]);

        $roadmap->update($validated);


        return redirect()->route('admin.roadmaps.index')->with('success', 'Roadmap item updated successfully.');
    }

    public function destroy(Roadmap $roadmap)
    {
        $roadmap->delete();
        return redirect()->route('admin.roadmaps.index')->with('success', 'Roadmap item deleted successfully.');
    }
}
