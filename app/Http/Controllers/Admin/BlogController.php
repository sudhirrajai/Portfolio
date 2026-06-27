<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Blogs/Index', [
            'blogs' => BlogPost::with('categories')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Blogs/Form', [
            'categories' => \App\Models\BlogCategory::orderBy('name', 'asc')->get()
        ]);
    }

    public function store(Request $request)
    {
        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_filter($tags)]);
        }

        $validated = $request->validate([
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'title' => 'required|string|max:255',
            'date' => 'required|string|max:255',
            'read_time' => 'required|string|max:255',
            'color' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'tags' => 'required|array',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('blogs', 'public');
        }
        unset($validated['image']);

        $validated['slug'] = Str::slug($validated['title']);

        $blog = BlogPost::create($validated);
        $blog->categories()->sync($request->category_ids ?? []);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post created successfully.');
    }

    public function edit(BlogPost $blog)
    {
        return Inertia::render('Admin/Blogs/Form', [
            'blog' => $blog->load('categories'),
            'categories' => \App\Models\BlogCategory::orderBy('name', 'asc')->get()
        ]);
    }

    public function update(Request $request, BlogPost $blog)
    {
        if (is_string($request->tags)) {
            $tags = array_map('trim', explode(',', $request->tags));
            $request->merge(['tags' => array_filter($tags)]);
        }

        $validated = $request->validate([
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:blog_categories,id',
            'title' => 'required|string|max:255',
            'date' => 'required|string|max:255',
            'read_time' => 'required|string|max:255',
            'color' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'tags' => 'required|array',
            'image' => 'nullable|image|max:3072',
        ]);

        if ($request->hasFile('image')) {
            if ($blog->image_path) {
                Storage::disk('public')->delete($blog->image_path);
            }
            $validated['image_path'] = $request->file('image')->store('blogs', 'public');
        }
        unset($validated['image']);

        $validated['slug'] = Str::slug($validated['title']);

        $blog->update($validated);
        $blog->categories()->sync($request->category_ids ?? []);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog)
    {
        if ($blog->image_path) {
            Storage::disk('public')->delete($blog->image_path);
        }
        $blog->delete();
        return redirect()->route('admin.blogs.index')->with('success', 'Blog post deleted successfully.');
    }
}
