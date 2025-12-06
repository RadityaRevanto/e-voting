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
    });

    Route::prefix('voter')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard/admin/voteguideline/page');
        })->name('voter.dashboard');
    });

// });

require __DIR__ . '/settings.php';
