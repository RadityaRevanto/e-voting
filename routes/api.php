<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaslonController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\UtilityController;
use App\Http\Controllers\VoteGuidelineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES (NO AUTH)
|--------------------------------------------------------------------------
*/
Route::get('/hello-world', [UtilityController::class, 'helloWorld']);

// Auth (login & refresh)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
});

// Vote Guidelines (public read)
Route::prefix('vote-guidelines')->group(function () {
    Route::get('/', [VoteGuidelineController::class, 'shows']);
});

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (AUTH REQUIRED)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Auth user
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/sessions', [AuthController::class, 'getActiveSessions']);
        Route::delete('/sessions/{tokenId}', [AuthController::class, 'revokeSession']);
    });

    Route::middleware('role:super_admin')->prefix('superadmin')->group(function () {
        Route::delete('/vote/clear', [VoteController::class, 'clearVotesData']);
        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    });

    // Admin only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Warga
        Route::post('/register-nik', [WargaController::class, 'registerNik']);

        // Paslon
        Route::prefix('paslon')->group(function () {
            Route::get('/', [PaslonController::class, 'index']);
            Route::get('/{id}', [PaslonController::class, 'show']);
            Route::post('/register', [PaslonController::class, 'register']);
            Route::delete('/{id}/delete', [PaslonController::class, 'deleteById']);
        });
        
        // Vote Guidelines (admin manage)
        Route::prefix('vote-guidelines')->group(function () {
            Route::post('/create', [VoteGuidelineController::class, 'create']);
            Route::post('/{id}/update', [VoteGuidelineController::class, 'updateById']);
            Route::delete('/{id}/delete', [VoteGuidelineController::class, 'deleteById']);
            Route::post('/swap', [VoteGuidelineController::class, 'swap']); // masih ngebug
        });
        
        // QR Codes
        Route::post('/qr-codes/generate', [QRCodeController::class, 'generate']);
        
        // Live Result
        Route::get('/vote/life-result', [VoteController::class, 'lifeResult']);
        Route::get('/vote/voting-process', [VoteController::class, 'votingProcess']);

        // Monitoring login logs (untuk keamanan)
        Route::get('/login-logs', [AuthController::class, 'getLoginLogs']);
    });

    // Paslon only
    Route::middleware('role:paslon')->prefix('paslon')->group(function () {
        Route::get('/', [PaslonController::class, 'test']);
        Route::post('/update-visi-misi', [PaslonController::class, 'updateVisiMisi']);
    });
    
    // Voter only
    Route::middleware('role:voter')->prefix('voter')->group(function () {
        // Paslon
        Route::prefix('paslon')->group(function () {
            Route::get('/', [PaslonController::class, 'index']);
            Route::get('/{id}', [PaslonController::class, 'show']);
        });

        // Voting
        Route::prefix('vote')->group(function () {
            Route::post('/create', [VoteController::class, 'create']);
        });
        
        // QR Code
        Route::prefix('qr-codes')->group(function () {
            Route::post('/validate', [QRCodeController::class, 'validate']);
            Route::get('/status/{token}', [QRCodeController::class, 'status']);
        });
    });

    // Current user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
