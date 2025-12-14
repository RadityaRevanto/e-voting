<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\VoteGuidelineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes - Autentikasi
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

// Protected routes - memerlukan autentikasi
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/sessions', [AuthController::class, 'getActiveSessions']);
        Route::delete('/sessions/{tokenId}', [AuthController::class, 'revokeSession']);
    });

    // Admin routes - hanya admin yang bisa akses
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Kelola pemilih (warga)
        Route::post('/register-nik', [WargaController::class, 'registerNik']);

        // Kelola pedoman pemilu (vote guidelines)
        Route::post('/vote-guidelines/create', [VoteGuidelineController::class, 'create']);
        Route::post('/vote-guidelines/{id}/update', [VoteGuidelineController::class, 'updateById']);
        Route::delete('/vote-guidelines/{id}/delete', [VoteGuidelineController::class, 'deleteById']);
        Route::post('/vote-guidelines/swap', [VoteGuidelineController::class, 'swap']); // Masih ngebug, jangan dipakai

        // Kelola QR codes
        Route::post('/qr-codes/generate', [QRCodeController::class, 'generate']);

        // Kelola hasil pemilu (life result)
        Route::get('/vote/life-result', [VoteController::class, 'lifeResult']);
    });

});

// Public routes - tidak memerlukan autentikasi
Route::group(['prefix' => 'vote-guidelines'], function () {
    Route::get('/', [VoteGuidelineController::class, 'shows']);
});

Route::group(['prefix' => 'vote'], function () {
    Route::post('/create', [VoteController::class, 'create']);
    Route::get('/voting-process', [VoteController::class, 'votingProcess']);
});

Route::group(['prefix' => 'qr-codes'], function () {
    Route::post('/validate', [QRCodeController::class, 'validate']);
    Route::get('/status/{token}', [QRCodeController::class, 'status']);
});
