<?php

use Illuminate\Support\Facades\Route;

Route::get('/', static fn () => response()->json([
    'name' => 'SIABooking backend1 API',
    'framework' => 'Laravel',
    'status' => 'ok',
]));