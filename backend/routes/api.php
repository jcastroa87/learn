<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Current user
    Route::get('/user', function (Request $request) {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'email' => $user->email,
            'email_verified_at' => $user->email_verified_at,
        ]);
    });

    // Account deletion
    Route::delete('/user', [\App\Http\Controllers\Auth\AccountController::class, 'destroy']);

    // Child profiles
    Route::apiResource('children', \App\Http\Controllers\ChildProfileController::class)
        ->parameters(['children' => 'child']);

    // Session config per child
    Route::get('/children/{child}/session-config', [\App\Http\Controllers\SessionConfigController::class, 'show']);
    Route::put('/children/{child}/session-config', [\App\Http\Controllers\SessionConfigController::class, 'update']);

    // Progress per child
    Route::get('/children/{child}/progress', [\App\Http\Controllers\ProgressController::class, 'index']);
    Route::get('/children/{child}/progress/summary', [\App\Http\Controllers\ProgressController::class, 'summary']);
    Route::post('/children/{child}/progress', [\App\Http\Controllers\ProgressController::class, 'store']);

    // Artworks per child
    Route::get('/children/{child}/artworks', [\App\Http\Controllers\ArtworkController::class, 'index']);
    Route::post('/children/{child}/artworks', [\App\Http\Controllers\ArtworkController::class, 'store']);
    Route::get('/children/{child}/artworks/{artwork}', [\App\Http\Controllers\ArtworkController::class, 'show']);
    Route::delete('/children/{child}/artworks/{artwork}', [\App\Http\Controllers\ArtworkController::class, 'destroy']);

    // Cosmetics shop
    Route::get('/cosmetics', [\App\Http\Controllers\CosmeticController::class, 'index']);
    Route::get('/children/{child}/cosmetics', [\App\Http\Controllers\CosmeticController::class, 'childCosmetics']);
    Route::post('/children/{child}/cosmetics/{cosmetic}/purchase', [\App\Http\Controllers\CosmeticController::class, 'purchase']);

    // Dashboard
    Route::get('/children/{child}/dashboard', [\App\Http\Controllers\DashboardController::class, 'show']);
});
