<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return redirect()->back()->with('message', 'Message successfully deleted.');
    }
}
