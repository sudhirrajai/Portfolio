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
            border-bottom: 4px solid #ff6bff;
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
        .message-box {
            background-color: #fafafa;
            border-left: 3px solid #000000;
            padding: 15px;
            margin-top: 5px;
            font-style: italic;
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
                <h1>New Client Message</h1>
            </div>
            <div class="email-body">
                <h2>Hi Sudhir, you've received a new inquiry through your portfolio!</h2>
                
                <div class="field-group">
                    <div class="field-label">Sender Name</div>
                    <div class="field-value">{{ $messageData->name }}</div>
                </div>

                <div class="field-group">
                    <div class="field-label">Sender Email</div>
                    <div class="field-value">
                        <a href="mailto:{{ $messageData->email }}" style="color: #356ae6;">{{ $messageData->email }}</a>
                    </div>
                </div>

                <div class="field-group" style="border-bottom: none;">
                    <div class="field-label">Message Inquiry</div>
                    <div class="field-value message-box">
                        {!! nl2br(e($messageData->message)) !!}
                    </div>
                </div>
            </div>
            <div class="email-footer">
                &copy; {{ date('Y') }} Sudhir Rajai Portfolio. Automated Notification.
            </div>
        </div>
    </div>
</body>
</html>
