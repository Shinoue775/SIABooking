<?php

use Illuminate\Support\Facades\Route;

// Public routes
Route::view('/', 'pages.landing')->name('landing');
Route::view('/home', 'pages.home')->name('home');
Route::view('/booking', 'pages.booking')->name('booking');
Route::view('/login', 'pages.login')->name('login');
Route::view('/register', 'pages.register')->name('register');

Route::get('/health-check', function () {
    return response()->json([
        'laravel' => app()->version(),
        'view_bound' => app()->bound('view'),
        'config_bound' => app()->bound('config'),
        'router_bound' => app()->bound('router'),
    ]);
});

