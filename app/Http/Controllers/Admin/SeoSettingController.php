<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\SeoSetting;
use Inertia\Inertia;

class SeoSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Seo/Index', [
            'seoSettings' => SeoSetting::orderBy('page_key', 'asc')->get(),
        ]);
    }

    public function update(Request $request, SeoSetting $seo)
    {
        $validated = $request->validate([
            'page_title' => 'required|string|max:150',
            'meta_description' => 'required|string|max:300',
            'meta_keywords' => 'nullable|string|max:500',
        ]);

        $seo->update($validated);

        return redirect()->back()->with('message', 'SEO Settings saved successfully!');
    }
}
