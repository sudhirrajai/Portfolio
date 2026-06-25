<?php

namespace App\Mail;

use App\Models\BlogComment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CommentApproved extends Mailable
{
    use Queueable, SerializesModels;

    public BlogComment $comment;

    public function __construct(BlogComment $comment)
    {
        $this->comment = $comment;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Your comment has been approved!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.comment_approved',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
