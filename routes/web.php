<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\Api\VoteLogController;
use App\Http\Controllers\Paslon\VisionMissionController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // General Dashboard - Redirect berdasarkan role
    Route::get('dashboard', function () {
        $user = auth()->user();
        $role = $user->role ?? null;

        return match ($role) {
            'paslon' => redirect()->route('paslon.dashboard'),
            'admin' => redirect()->route('admin.dashboard'),
            'super_admin' => redirect()->route('admin.dashboard'),
            'user' => redirect()->route('user.vote'),
            default => redirect()->route('home'),
        };
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Paslon Dashboard Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('paslon')->group(function () {
        // Dashboard
        Route::get('dashboard', function () {
            return Inertia::render('dashboard/paslon/dashboard/page');
        })->name('paslon.dashboard');

        Route::get('dashboard/change', function () {
            $user = auth()->user();
            return Inertia::render('dashboard/paslon/dashboard/change/page', [
                'vision' => $user->vision ?? '',
                'missions' => $user->mission ?? [''],
            ]);
        })->name('paslon.dashboard.change');

        // Settings
        Route::get('settings', function () {
            return Inertia::render('dashboard/paslon/settings/page');
        })->name('paslon.settings');

        Route::get('settings/change-password', function () {
            return Inertia::render('dashboard/paslon/settings/change-password/page');
        })->name('paslon.settings.change-password');

        Route::get('settings/edit-profil', function () {
            return Inertia::render('dashboard/paslon/settings/edit-profil/page');
        })->name('paslon.settings.edit-profil');

        // API Routes
        Route::prefix('dashboard')->group(function () {
            Route::put('vision-mission', [VisionMissionController::class, 'update'])
                ->name('paslon.dashboard.vision-mission.update');
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Dashboard Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('admin')->group(function () {
        // Dashboard
        Route::get('dashboard', function () {
            return Inertia::render('dashboard/admin/dashboard/page');
        })->name('admin.dashboard');

        Route::get('dashboard/view', function () {
            return Inertia::render('dashboard/admin/dashboard/view/page');
        })->name('admin.dashboard.view');

        // Vote Management
        Route::get('vote', function () {
            return Inertia::render('dashboard/admin/vote/page');
        })->name('admin.vote');

        Route::get('vote/tambah', function () {
            return Inertia::render('dashboard/admin/vote/tambah/page');
        })->name('admin.vote.tambah');

        Route::get('vote/hapus', function () {
            return Inertia::render('dashboard/admin/vote/hapus/page');
        })->name('admin.vote.hapus');

        // Vote Guidelines
        Route::get('voteguideline', function () {
            return Inertia::render('dashboard/admin/voteguideline/page');
        })->name('admin.voteguideline');

        // Generate
        Route::get('generate', function () {
            return Inertia::render('dashboard/admin/generate/page');
        })->name('admin.generate');

        // Settings
        Route::get('settings', function () {
            return Inertia::render('dashboard/admin/settings/page');
        })->name('admin.settings');

        Route::get('settings/about-us', function () {
            return Inertia::render('dashboard/admin/settings/about-us/page');
        })->name('admin.settings.about-us');

        Route::get('settings/change-password', function () {
            return Inertia::render('dashboard/admin/settings/change-password/page');
        })->name('admin.settings.change-password');

        Route::get('settings/edit-profil', function () {
            return Inertia::render('dashboard/admin/settings/edit-profil/page');
        })->name('admin.settings.edit-profil');

        Route::get('settings/privacy-police', function () {
            return Inertia::render('dashboard/admin/settings/privacy-police/page');
        })->name('admin.settings.privacy-police');

        Route::get('settings/term-of', function () {
            return Inertia::render('dashboard/admin/settings/term-of/page');
        })->name('admin.settings.term-of');
    });

    /*
    |--------------------------------------------------------------------------
    | User Dashboard Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('user')->group(function () {
        // Vote
        Route::get('vote', function () {
            return Inertia::render('dashboard/user/vote/page');
        })->name('user.vote');

        Route::get('vote/view/{id}', function ($id) {
            return Inertia::render('dashboard/user/vote/view/page', [
                'candidateId' => $id,
            ]);
        })->name('user.vote.view');

        // Vote Guidelines
        Route::get('voteguideline', function () {
            return Inertia::render('dashboard/user/voteguideline/page');
        })->name('user.voteguideline');
    });

    /*
    |--------------------------------------------------------------------------
    | Superadmin Dashboard Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('superadmin')->group(function () {
        Route::get('log-activity', function () {
            return Inertia::render('dashboard/superadmin/log-activity/page');
        })->name('superadmin.log-activity');

        Route::get('akun-admin', function () {
            return Inertia::render('dashboard/superadmin/akun-admin/page');
        })->name('superadmin.akun-admin');
    });

    /*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('api')->group(function () {
        Route::post('votes', [VoteLogController::class, 'store'])
            ->name('api.votes.store');

        Route::get('vote-logs', [VoteLogController::class, 'index'])
            ->name('api.vote-logs.index');

        Route::get('vote-statistics', [VoteLogController::class, 'statistics'])
            ->name('api.vote-statistics');
    });
});

require __DIR__ . '/settings.php';
