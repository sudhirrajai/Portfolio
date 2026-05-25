<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Profile;
use Inertia\Inertia;

class PortfolioProfileController extends Controller
{
    public function edit()
    {
        $profile = Profile::first();
        return Inertia::render('Admin/Profile/Edit', [
            'profile' => $profile
        ]);
    }

    public function update(Request $request)
    {
        $profile = Profile::first();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'summary' => 'required|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'is_available' => 'required|boolean',
            'working_hours_start' => 'required|string|max:5',
            'working_hours_end' => 'required|string|max:5',
            'linkedin' => 'nullable|url|max:255',
            'github' => 'nullable|url|max:255',
            'resume' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        if ($request->hasFile('resume')) {
            $file = $request->file('resume');
            $filename = 'SudhirRajai_Resume.' . $file->getClientOriginalExtension();
            $destinationPath = public_path('uploads/resumes');
            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            // 1. Delete old active resume file if exists in database
            if ($profile->resume_path && file_exists(public_path($profile->resume_path))) {
                @unlink(public_path($profile->resume_path));
            }

            // 2. Explicitly ensure any existing file with this exact new filename is removed
            $targetFilePath = $destinationPath . '/' . $filename;
            if (file_exists($targetFilePath)) {
                @unlink($targetFilePath);
            }

            $file->move($destinationPath, $filename);

            $profile->resume_path = 'uploads/resumes/' . $filename;
            $profile->save();
        }

        // Inject flattened inputs into the social_links JSON structure
        $socialLinks = [
            'github' => $request->input('github'),
            'linkedin' => $request->input('linkedin'),
        ];
        
        $updateData = array_diff_key($validated, array_flip(['linkedin', 'github', 'resume']));
        $updateData['social_links'] = $socialLinks;

        $profile->update($updateData);

        return redirect()->back()->with('message', 'Portfolio Profile successfully updated.');
    }
}
