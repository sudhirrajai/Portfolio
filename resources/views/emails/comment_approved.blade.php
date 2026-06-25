<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f4f4f7;
            color: #51545e;
            margin: 0;
            padding: 0;
            width: 100% !important;
        }
        .wrapper {
            background-color: #f4f4f7;
            padding: 40px 20px;
        }
        .email-content {
            max-width: 570px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e8e5ef;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .email-header {
            background-color: #000000;
            padding: 25px;
            text-align: center;
            border-bottom: 4px solid #FA76FF;
        }
        .email-header h1 {
            color: #ffffff;
            font-size: 20px;
            margin: 0;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .email-body {
            padding: 35px;
        }
        .email-body h2 {
            color: #333333;
            font-size: 18px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .comment-box {
            background-color: #fafafa;
            border-left: 3px solid #FA76FF;
            padding: 15px 20px;
            margin: 20px 0;
            font-style: italic;
            color: #444;
            font-size: 15px;
            line-height: 1.6;
            border-radius: 0 6px 6px 0;
        }
        .field-label {
            font-size: 11px;
            font-weight: bold;
            color: #FA76FF;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }
        .cta-button {
            display: inline-block;
            margin-top: 24px;
            padding: 14px 28px;
            background-color: #000000;
            color: #ffffff !important;
            text-decoration: none;
            font-weight: bold;
            font-size: 13px;
            letter-spacing: 1px;
            text-transform: uppercase;
            border-radius: 4px;
        }
        .email-footer {
            text-align: center;
            padding: 25px;
            font-size: 12px;
            color: #a8a8ab;
            border-top: 1px solid #f0f0f0;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="email-content">
            <div class="email-header">
                <h1>Comment Approved ✅</h1>
            </div>
            <div class="email-body">
                <h2>Hey {{ $comment->name }}, your comment is live!</h2>
                <p>Your comment on the blog post <strong>"{{ $comment->blogPost->title }}"</strong> has been reviewed and approved. It is now publicly visible on the site.</p>

                <div class="field-label">Your Comment</div>
                <div class="comment-box">
                    {!! nl2br(e($comment->body)) !!}
                </div>

                <a href="{{ url('/blog/' . $comment->blogPost->slug) }}" class="cta-button">
                    View Your Comment →
                </a>
            </div>
            <div class="email-footer">
                &copy; {{ date('Y') }} Sudhir Rajai Portfolio. This is an automated notification.
            </div>
        </div>
    </div>
</body>
</html>
