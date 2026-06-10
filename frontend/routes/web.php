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

// Temporary debug route — remove after troubleshooting
Route::get('/env-debug', function () {
    $envPath = base_path('.env');
    $raw = null;
    if (file_exists($envPath)) {
        $raw = substr(file_get_contents($envPath), 0, 2000); // limit output
    }

    return response()->json([
        'env_path' => $envPath,
        'env_file_head' => $raw,
        'SUPABASE_URL' => env('SUPABASE_URL'),
        'SUPABASE_ANON_KEY_preview' => env('SUPABASE_ANON_KEY') ? substr(env('SUPABASE_ANON_KEY'), 0, 20) . '...' : null,
        'getenv_SUPABASE_URL' => getenv('SUPABASE_URL'),
        'ENV_array_preview' => array_key_exists('SUPABASE_URL', $_ENV) ? substr((string) ($_ENV['SUPABASE_URL'] ?? ''), 0, 80) : null,
        'SERVER_array_preview' => array_key_exists('SUPABASE_URL', $_SERVER) ? substr((string) ($_SERVER['SUPABASE_URL'] ?? ''), 0, 80) : null,
    ]);
});

// Temporary cURL test route — remove after troubleshooting
Route::get('/curl-test', function () {
    if (! function_exists('curl_version')) {
        return response()->json(['curl' => false, 'message' => 'cURL not available']);
    }

    $info = curl_version();

    return response()->json([
        'curl' => true,
        'version' => $info['version'] ?? null,
        'ssl_version' => $info['ssl_version'] ?? null,
        'libz_version' => $info['libz_version'] ?? null,
    ]);
});

