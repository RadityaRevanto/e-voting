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
    });
// });

require __DIR__ . '/settings.php';
