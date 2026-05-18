<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // 1. Pull explicit Featured projects, falling back to latest projects if fewer than 3 highlights chosen
    $projects = \App\Models\Project::where('is_featured', true)->take(3)->get();
    if ($projects->count() < 3) {
        $needed = 3 - $projects->count();
        $excluded = $projects->pluck('id');
        $fallbacks = \App\Models\Project::whereNotIn('id', $excluded)
            ->latest()
            ->take($needed)
            ->get();
        $projects = $projects->concat($fallbacks);
    }

    // 2. Pull 3 random articles to fill layout emptiness
    $blogPosts = \App\Models\BlogPost::inRandomOrder()->take(3)->get();
    
    $profile = \App\Models\Profile::first();
    $experience = \App\Models\Experience::orderBy('created_at', 'desc')->get();
    $education = \App\Models\Education::orderBy('created_at', 'desc')->get();

    return Inertia::render('Portfolio/Home', [
        'projects' => $projects,
        'blogPosts' => $blogPosts,
        'profile' => $profile,
        'experience' => $experience,
        'education' => $education
    ]);
});

Route::get('/work', function () {
    $projects = \App\Models\Project::orderBy('year', 'desc')->get();
    return Inertia::render('Portfolio/Work', [
        'projects' => $projects
    ]);
});

Route::get('/about', function () {
    $profile = \App\Models\Profile::first();
    $experience = \App\Models\Experience::orderBy('created_at', 'asc')->get();
    $education = \App\Models\Education::orderBy('created_at', 'asc')->get();
    $skills = \App\Models\Skill::orderBy('created_at', 'asc')->get();

    return Inertia::render('Portfolio/About', [
        'profile' => $profile,
        'experience' => $experience,
        'education' => $education,
        'skills' => $skills
    ]);
});

Route::get('/blog', function () {
    $blogs = \App\Models\BlogPost::orderBy('created_at', 'desc')->get();
    return Inertia::render('Portfolio/Blog', ['blogs' => $blogs]);
});

Route::get('/blog/{slug}', function ($slug) {
    $blog = \App\Models\BlogPost::where('slug', $slug)->firstOrFail();
    return Inertia::render('Portfolio/BlogPost', ['post' => $blog]);
});

Route::get('/captcha/image', [\App\Http\Controllers\ContactController::class, 'getCaptchaImage'])->name('captcha.image');
Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'index'])->name('contact.show');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');
Route::get('/contact/available-slots', [\App\Http\Controllers\ContactBookingController::class, 'getAvailableSlots'])->name('contact.bookings.slots');
Route::post('/contact/book', [\App\Http\Controllers\ContactBookingController::class, 'store'])->name('contact.bookings.store');

Route::get('/work/{slug}', function ($slug) {
    $project = \App\Models\Project::where('slug', $slug)->firstOrFail();
    return Inertia::render('Portfolio/ProjectDetail', ['project' => $project]);
});

Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('admin/projects', \App\Http\Controllers\Admin\ProjectController::class)->names([
        'index' => 'admin.projects.index',
        'create' => 'admin.projects.create',
        'store' => 'admin.projects.store',
        'show' => 'admin.projects.show',
        'edit' => 'admin.projects.edit',
        'update' => 'admin.projects.update',
        'destroy' => 'admin.projects.destroy',
    ]);
    Route::resource('admin/blogs', \App\Http\Controllers\Admin\BlogController::class)->names([
        'index' => 'admin.blogs.index',
        'create' => 'admin.blogs.create',
        'store' => 'admin.blogs.store',
        'show' => 'admin.blogs.show',
        'edit' => 'admin.blogs.edit',
        'update' => 'admin.blogs.update',
        'destroy' => 'admin.blogs.destroy',
    ]);
    Route::resource('admin/experiences', \App\Http\Controllers\Admin\ExperienceController::class)->names([
        'index' => 'admin.experiences.index',
        'create' => 'admin.experiences.create',
        'store' => 'admin.experiences.store',
        'show' => 'admin.experiences.show',
        'edit' => 'admin.experiences.edit',
        'update' => 'admin.experiences.update',
        'destroy' => 'admin.experiences.destroy',
    ]);
    Route::resource('admin/educations', \App\Http\Controllers\Admin\EducationController::class)->names([
        'index' => 'admin.educations.index',
        'create' => 'admin.educations.create',
        'store' => 'admin.educations.store',
        'show' => 'admin.educations.show',
        'edit' => 'admin.educations.edit',
        'update' => 'admin.educations.update',
        'destroy' => 'admin.educations.destroy',
    ]);
    Route::resource('admin/skills', \App\Http\Controllers\Admin\SkillController::class)->names([
        'index' => 'admin.skills.index',
        'create' => 'admin.skills.create',
        'store' => 'admin.skills.store',
        'show' => 'admin.skills.show',
        'edit' => 'admin.skills.edit',
        'update' => 'admin.skills.update',
        'destroy' => 'admin.skills.destroy',
    ]);
    Route::resource('admin/messages', \App\Http\Controllers\Admin\MessageController::class)->only(['index', 'destroy'])->names([
        'index' => 'admin.messages.index',
        'destroy' => 'admin.messages.destroy',
    ]);
    Route::get('admin/profile', [\App\Http\Controllers\Admin\PortfolioProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::put('admin/profile', [\App\Http\Controllers\Admin\PortfolioProfileController::class, 'update'])->name('admin.profile.update');
    Route::get('admin/seo', [\App\Http\Controllers\Admin\SeoSettingController::class, 'index'])->name('admin.seo.index');
    Route::put('admin/seo/{seo}', [\App\Http\Controllers\Admin\SeoSettingController::class, 'update'])->name('admin.seo.update');

    // Dynamic "Schedule a Call" Admin & Google Integrations
    Route::get('admin/bookings', [\App\Http\Controllers\Admin\BookingController::class, 'index'])->name('admin.bookings.index');
    Route::put('admin/bookings/settings', [\App\Http\Controllers\Admin\BookingController::class, 'updateSettings'])->name('admin.bookings.settings');
    Route::delete('admin/bookings/{booking}', [\App\Http\Controllers\Admin\BookingController::class, 'destroy'])->name('admin.bookings.destroy');
    
    Route::get('admin/google/connect', [\App\Http\Controllers\Admin\BookingController::class, 'redirectToGoogle'])->name('admin.google.connect');
    Route::get('admin/google/callback', [\App\Http\Controllers\Admin\BookingController::class, 'handleGoogleCallback'])->name('admin.google.callback');
    Route::post('admin/google/revoke', [\App\Http\Controllers\Admin\BookingController::class, 'revokeGoogleConnection'])->name('admin.google.revoke');

    // Dynamic SMTP Server Configuration & Diagnostics
    Route::get('admin/mail', [\App\Http\Controllers\Admin\MailSettingsController::class, 'index'])->name('admin.mail.index');
    Route::put('admin/mail', [\App\Http\Controllers\Admin\MailSettingsController::class, 'update'])->name('admin.mail.update');
    Route::post('admin/mail/test', [\App\Http\Controllers\Admin\MailSettingsController::class, 'sendTestMail'])->name('admin.mail.test');
});

require __DIR__.'/auth.php';
