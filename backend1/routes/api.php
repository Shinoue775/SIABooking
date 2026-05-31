<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SchemaController;
use App\Http\Middleware\AuthenticateSupabaseToken;
use Illuminate\Support\Facades\Route;

Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/availability', [RoomController::class, 'availability']);

Route::middleware(AuthenticateSupabaseToken::class)->group(function (): void {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
    Route::get('/schema', SchemaController::class);
});
