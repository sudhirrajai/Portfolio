<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\DownloadFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DownloadFileController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Files/Index', [
            'files' => DownloadFile::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|max:102400', // max 100MB
            'is_public' => 'boolean',
        ]);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('secure_downloads');

            DownloadFile::create([
                'title' => $request->title,
                'description' => $request->description,
                'original_filename' => $request->file('file')->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $request->file('file')->getClientMimeType(),
                'size_bytes' => $request->file('file')->getSize(),
                'is_public' => $request->boolean('is_public', true),
            ]);

            return redirect()->back()->with('success', 'File uploaded successfully!');
        }

        return redirect()->back()->withErrors(['file' => 'No file uploaded.']);
    }

    public function update(Request $request, DownloadFile $file)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'required|boolean',
        ]);

        $file->update($validated);

        return redirect()->back()->with('success', 'File settings updated successfully!');
    }

    public function destroy(DownloadFile $file)
    {
        if (Storage::exists($file->file_path)) {
            Storage::delete($file->file_path);
        }

        $file->delete();

        return redirect()->back()->with('success', 'File deleted successfully!');
    }
}
