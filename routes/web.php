<?php

use App\Http\Controllers\VoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::group(['prefix' => 'betest'], function () {
    Route::group(['prefix' => 'vote'], function () {
        Route::get('/create', [VoteController::class, 'create']);
        Route::get('/validate', [VoteController::class, 'validate']);
    });
});

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
