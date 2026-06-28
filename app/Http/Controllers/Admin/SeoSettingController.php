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
            'seoSettings' => SeoSetting::where('page_key', '!=', 'global')->orderBy('page_key', 'asc')->get(),
            'globalSeo' => SeoSetting::where('page_key', 'global')->first(),
        ]);
    }

    public function update(Request $request, SeoSetting $seo)
    {
        if ($seo->page_key === 'global') {
            $validated = $request->validate([
                'google_analytics_id' => 'nullable|string|max:50',
                'google_search_console_id' => 'nullable|string|max:100',
                'custom_meta_tags' => 'nullable|string',
            ]);
        } else {
            $validated = $request->validate([
                'page_title' => 'required|string|max:150',
                'meta_description' => 'required|string|max:300',
                'meta_keywords' => 'nullable|string|max:500',
            ]);
        }

        $seo->update($validated);

        return redirect()->back()->with('message', 'SEO Settings saved successfully!');
    }
}
