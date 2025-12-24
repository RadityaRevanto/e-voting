<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

/*
|--------------------------------------------------------------------------
| Web Routes untuk SPA (Inertia + Sanctum)
|--------------------------------------------------------------------------
|
| Penting:
| - TIDAK menggunakan middleware auth/web/session di sini.
| - TIDAK memakai auth()->user() / logic role di web routes.
| - File ini HANYA merender Inertia page (UI shell).
| - Proteksi auth & role DIATUR di routes/api.php dengan auth:sanctum.
| - Frontend (React) akan baca token, panggil API, dan atur redirect/akses.
|
*/

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
| Paslon Dashboard Routes (Inertia only, tanpa auth middleware)
|--------------------------------------------------------------------------
|
| Semua data user/paslon di-load dari API menggunakan token (Authorization: Bearer).
| Komponen React bertugas memanggil API yang sudah diproteksi auth:sanctum.
|
*/
Route::prefix('paslon')->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard/paslon/dashboard/page');
    })->name('paslon.dashboard');

    Route::get('dashboard/change', function () {
        // Jangan gunakan auth()->user() di sini.
        // Komponen React akan memanggil API untuk mengambil vision & mission.
        return Inertia::render('dashboard/paslon/dashboard/change/page', [
            'vision' => null,
            'missions' => [],
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
});

/*
|--------------------------------------------------------------------------
| Admin Dashboard Routes (Inertia only, tanpa auth middleware)
|--------------------------------------------------------------------------
|
| Admin pages tetap bebas middleware di web.php.
| Proteksi "hanya admin" dilakukan di layer API (auth:sanctum + peran).
|
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
| User Dashboard Routes (Inertia only, tanpa auth middleware)
|--------------------------------------------------------------------------
|
| Halaman user hanya shell React.
| Data pemilih, status vote, dsb diambil dari API yang sudah dilindungi Sanctum.
|
*/
Route::prefix('user')->group(function () {
    // Vote
    Route::get('vote', function () {
        return Inertia::render('dashboard/user/vote/page');
    })->name('user.vote');

    Route::get('vote/view/{id}', function ($id) {
        // ID kandidat diteruskan untuk kebutuhan routing internal;
        // detail kandidat tetap diambil via API berdasarkan token.
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
| Superadmin Dashboard Routes (Inertia only, tanpa auth middleware)
|--------------------------------------------------------------------------
|
| Superadmin-only access dikontrol oleh API (auth:sanctum + role check),
| bukan oleh middleware web.
|
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
| Route Setting Lain
|--------------------------------------------------------------------------
*/

require __DIR__ . '/settings.php';