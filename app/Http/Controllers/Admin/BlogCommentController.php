<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogComment;
use App\Models\BlogPost;
use App\Models\SmtpSetting;
use App\Mail\CommentApproved;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BlogCommentController extends Controller
{
    /**
     * List all comments with optional status filtering.
     */
    public function index(Request $request)
    {
        $status = $request->query('status', 'all');

        $query = BlogComment::with(['blogPost:id,title,slug', 'parent:id,name'])
            ->orderBy('created_at', 'desc');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $comments = $query->paginate(20)->withQueryString();

        $counts = [
            'all'      => BlogComment::count(),
            'pending'  => BlogComment::where('status', 'pending')->count(),
            'approved' => BlogComment::where('status', 'approved')->count(),
            'rejected' => BlogComment::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Comments/Index', [
            'comments' => $comments,
            'counts'   => $counts,
            'filter'   => $status,
        ]);
    }

    /**
     * Approve a comment and notify the commenter by email.
     */
    public function approve(BlogComment $comment)
    {
        $comment->update(['status' => 'approved']);

        // Send email notification to the commenter
        try {
            $smtp = SmtpSetting::first();
            if ($smtp && !empty($smtp->host)) {
                config([
                    'mail.default' => 'smtp',
                    'mail.mailers.smtp.host' => $smtp->host,
                    'mail.mailers.smtp.port' => (int) $smtp->port,
                    'mail.mailers.smtp.username' => $smtp->username,
                    'mail.mailers.smtp.password' => $smtp->password,
                    'mail.mailers.smtp.encryption' => $smtp->encryption,
                    'mail.from.address' => $smtp->from_address,
                    'mail.from.name' => $smtp->from_name,
                ]);
                app()->make('mail.manager')->forgetMailers();
            }

            Mail::to($comment->email)->send(new CommentApproved($comment));
        } catch (\Exception $e) {
            Log::warning('Failed to send comment approval email: ' . $e->getMessage());
        }

        return back()->with('message', 'Comment approved and commenter notified.');
    }

    /**
     * Reject a comment.
     */
    public function reject(BlogComment $comment)
    {
        $comment->update(['status' => 'rejected']);
        return back()->with('message', 'Comment rejected.');
    }

    /**
     * Delete a comment permanently.
     */
    public function destroy(BlogComment $comment)
    {
        $comment->delete();
        return back()->with('message', 'Comment deleted.');
    }
}
