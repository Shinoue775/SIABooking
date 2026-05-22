<?php

use Illuminate\Support\Facades\Route;

// Public routes
Route::view('/', 'pages.landing')->name('landing');
Route::view('/home', 'pages.home')->name('home');
Route::view('/booking', 'pages.booking')->name('booking');
Route::view('/login', 'pages.login')->name('login');
Route::view('/register', 'pages.register')->name('register');