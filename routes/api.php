<?php

use App\Http\Controllers\PaslonController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WargaController;
use App\Http\Controllers\QRCodeController;
use App\Http\Controllers\VoteGuidelineController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'admin'], function () {
    Route::post('/register-nik', [WargaController::class, 'registerNik']);
});

Route::group(['prefix' => 'paslon'], function () {
    Route::get('{id}/votes', [PaslonController::class, 'getVotes']);
});

Route::group(['prefix' => 'vote'], function () {
    Route::post('/create', [VoteController::class, 'create']);
    Route::get('/life-result', [VoteController::class, 'lifeResult']);
    Route::get('/voting-process', [VoteController::class, 'votingProcess']);
});

Route::group(['prefix' => 'qr-codes'], function () {
    Route::post('/generate', [QRCodeController::class, 'generate']);
    Route::post('/validate', [QRCodeController::class, 'validate']);
    Route::get('/status/{token}', [QRCodeController::class, 'status']);
});

Route::group(['prefix' => 'vote-guidelines'], function () {
    Route::get('/', [VoteGuidelineController::class, 'shows']);
    Route::post('/create', [VoteGuidelineController::class, 'create']);
    Route::post('/{id}/update', [VoteGuidelineController::class, 'updateById']);
    Route::post('/swap', [VoteGuidelineController::class, 'swap']); // Masih ngebug, jangan dipakai
    Route::delete('/{id}/delete', [VoteGuidelineController::class, 'deleteById']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
