<?php

use App\Http\Controllers\VoteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'vote'], function () {
    Route::post('/create', [VoteController::class, 'create']);
    Route::get('/validate', [VoteController::class, 'validate']);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
