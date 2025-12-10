<?php

use App\Http\Controllers\PaslonController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\WargaController;
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
    Route::get('/validate', [VoteController::class, 'validate']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
