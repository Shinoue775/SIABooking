<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SchemaController;
use App\Http\Middleware\AuthenticateSupabaseToken;
use Illuminate\Support\Facades\Route;

// ─── Health / diagnostic (no auth required) ─────────────────────────────────
Route::get('/health', function () {
    $supabaseUrl = config('services.supabase.url');
    $hasServiceKey = ! empty(config('services.supabase.service_role_key'));
    $encryptionKey = config('siabooking.data_encryption_key');

    return response()->json([
        'status'              => 'ok',
        'supabase_url'        => $supabaseUrl ?: '⚠ NOT SET',
        'supabase_key_set'    => $hasServiceKey,
        'encryption_key_set'  => ! empty($encryptionKey),
        'app_env'             => config('app.env'),
        'php_version'         => PHP_VERSION,
        'timestamp'           => now()->toIso8601String(),
    ]);
});

// ─── Public routes ───────────────────────────────────────────────────────────
Route::post('/auth/register', [AuthController::class, 'register']);

Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/availability', [RoomController::class, 'availability']);

// ─── Protected routes (requires Supabase Bearer token) ───────────────────────
Route::middleware(AuthenticateSupabaseToken::class)->group(function (): void {
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{id}', [BookingController::class, 'destroy']);
    Route::get('/schema', SchemaController::class);
});

