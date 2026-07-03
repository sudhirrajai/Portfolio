<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\DownloadFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PublicFileController extends Controller
{
    public function preview($id)
    {
        $file = DownloadFile::findOrFail($id);

        // Check if file is private and user is not admin
        if (!$file->is_public && !Auth::check()) {
            abort(403, 'Unauthorized access to this file.');
        }

        // Increment view count
        $file->increment('views_count');

        return Inertia::render('Portfolio/Files/Preview', [
            'file' => $file
        ]);
    }

    public function download($id)
    {
        $file = DownloadFile::findOrFail($id);

        // Check if file is private and user is not admin
        if (!$file->is_public && !Auth::check()) {
            abort(403, 'Unauthorized access to this file.');
        }

        // Increment download count
        $file->increment('downloads_count');

        return Storage::download($file->file_path, $file->original_filename);
    }
}
