<?php

use App\Http\Controllers\VoteController;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\QRCodeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin'], function () {
    Route::post('/register-nik', [WargaController::class, 'registerNik']);
});

Route::group(['prefix' => 'vote'], function () {
    Route::post('/create', [VoteController::class, 'create']);
    Route::get('/validate', [VoteController::class, 'validate']);
});

// QR Code routes
Route::group(['prefix' => 'qr-codes'], function () {
    Route::post('/generate', [QRCodeController::class, 'generate']);
    Route::post('/validate', [QRCodeController::class, 'validate']);
    Route::get('/status/{token}', [QRCodeController::class, 'status']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
