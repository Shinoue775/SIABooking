<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->append(\App\Http\Middleware\HandleApiCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

// On Vercel (serverless), redirect writable storage paths to /tmp so that
// Blade view compilation and framework caches do not fail on the read-only
// filesystem that Vercel provides outside of the function package.
if (isset($_ENV['VERCEL']) || getenv('VERCEL')) {
    $tmpStorage = '/tmp/laravel-storage';
    foreach ([
        'app',
        'framework/cache/data',
        'framework/sessions',
        'framework/views',
        'logs',
    ] as $subPath) {
        @mkdir($tmpStorage.'/'.$subPath, 0755, true);
    }
    $app->useStoragePath($tmpStorage);
}

return $app;
