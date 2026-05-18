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
            background-color: #ff6bff;
            padding: 25px;
            text-align: center;
            border-bottom: 4px solid #000000;
        }
        .email-header h1 {
            color: #000000;
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
            margin-bottom: 25px;
        }
        .field-group {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px dashed #e8e5ef;
        }
        .field-label {
            font-size: 11px;
            font-weight: bold;
            color: #ff6bff;
            text-transform: uppercase;
            margin-bottom: 5px;
            letter-spacing: 0.5px;
        }
        .field-value {
            color: #1a1a1a;
            font-size: 15px;
            line-height: 1.5;
        }
        .meet-button {
            display: block;
            text-align: center;
            background-color: #000000;
            color: #ffffff !important;
            font-weight: bold;
            font-size: 13px;
            text-decoration: none;
            text-transform: uppercase;
            padding: 15px;
            border-radius: 8px;
            letter-spacing: 1px;
            margin: 25px 0 15px 0;
        }
        .email-footer {
            text-align: center;
            padding: 25px;
            font-size: 12px;
            color: #a8a8ab;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="email-content">
            <div class="email-header">
                <h1>New Discovery Call!</h1>
            </div>
            <div class="email-body">
                <h2>A client has locked in a direct 1-on-1 session on your calendar.</h2>
                
                <div class="field-group">
                    <div class="field-label">Who</div>
                    <div class="field-value"><strong>{{ $booking->name }}</strong> ({{ $booking->email }})</div>
                </div>

                <div class="field-group">
                    <div class="field-label">Scheduled Time</div>
                    <div class="field-value" style="font-size: 18px; color: #000;">
                        {{ $booking->scheduled_at->format('l, F d, Y \a\t g:i A') }}
                    </div>
                </div>

                @if($booking->timezone)
                <div class="field-group">
                    <div class="field-label">Client's Timezone</div>
                    <div class="field-value">{{ $booking->timezone }}</div>
                </div>
                @endif

                @if($booking->brief_notes)
                <div class="field-group">
                    <div class="field-label">Topics/Notes</div>
                    <div class="field-value" style="font-style: italic;">
                        {{ $booking->brief_notes }}
                    </div>
                </div>
                @endif

                @if($booking->google_meet_url)
                <a href="{{ $booking->google_meet_url }}" class="meet-button" target="_blank">
                    💻 Join Google Meet
                </a>
                <div style="text-align: center; font-size: 11px; color: #888;">
                    Automatically synced with your Google Calendar.
                </div>
                @else
                <div style="margin-top: 20px; font-size: 12px; color: #d93025; text-align: center;">
                    ⚠️ Note: No Google Meet link generated. (Google API not connected at booking time)
                </div>
                @endif
            </div>
            <div class="email-footer">
                &copy; {{ date('Y') }} Sudhir Rajai Portfolio. Automated Notification.
            </div>
        </div>
    </div>
</body>
</html>
