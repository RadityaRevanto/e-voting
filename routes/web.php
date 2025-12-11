<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');

    // Paslon Dashboard Routes
    Route::prefix('paslon')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard/paslon/dashboard/page');
        })->name('paslon.dashboard');
        
        Route::get('settings', function () {
            return Inertia::render('dashboard/paslon/settings/page');
        })->name('paslon.settings');
    });

    // Admin Dashboard Routes
    Route::prefix('admin')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard/admin/dashboard/page');
        })->name('admin.dashboard');

        Route::get('voteguideline', function () {
            return Inertia::render('dashboard/admin/voteguideline/page');
        })->name('admin.voteguideline');

        Route::get('vote', function () {
            return Inertia::render('dashboard/admin/vote/page');
        })->name('admin.vote');

        Route::get('vote/tambah', function () {
            return Inertia::render('dashboard/admin/vote/tambah/page');
        })->name('admin.vote.tambah');

        Route::get('vote/hapus', function () {
            return Inertia::render('dashboard/admin/vote/hapus/page');
        })->name('admin.vote.hapus');

        Route::get('generate', function () {
            return Inertia::render('dashboard/admin/generate/page');
        })->name('admin.generate');

        Route::get('settings', function () {
            return Inertia::render('dashboard/admin/settings/page');
        })->name('admin.settings');

        Route::get('settings/about-us', function () {
            return Inertia::render('dashboard/admin/settings/about-us/page');
        })->name('admin.settings.about-us');

        Route::get('settings/change-password', function () {
            return Inertia::render('dashboard/admin/settings/change-password/page');
        })->name('admin.settings.change-password');

        Route::get('settings/contact-us', function () {
            return Inertia::render('dashboard/admin/settings/contact-us/page');
        })->name('admin.settings.contact-us');

        Route::get('settings/edit-profil', function () {
            return Inertia::render('dashboard/admin/settings/edit-profil/page');
        })->name('admin.settings.edit-profil');

        Route::get('settings/language', function () {
            return Inertia::render('dashboard/admin/settings/language/page');
        })->name('admin.settings.language');

        Route::get('settings/privacy-police', function () {
            return Inertia::render('dashboard/admin/settings/privacy-police/page');
        })->name('admin.settings.privacy-police');

        Route::get('settings/term-of', function () {
            return Inertia::render('dashboard/admin/settings/term-of/page');
        })->name('admin.settings.term-of');
    });

    // User Dashboard Routes
Route::prefix('user')->group(function () {
    // Ganti path Inertia render
    Route::get('vote', function () {
        return Inertia::render('dashboard/user/vote/page');
    })->name('user.vote');

    Route::get('voteguideline', function () {
        return Inertia::render('dashboard/user/voteguideline/page');
    })->name('user.voteguideline');

});

// });
require __DIR__ . '/settings.php';
