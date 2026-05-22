<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

$app = Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
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

    // Generate an ephemeral encryption key when APP_KEY is not configured in
    // Vercel environment variables.  Each serverless invocation is stateless,
    // so a per-request key is acceptable here; the app can still render views
    // and serve pages.  For full CSRF and session persistence, set APP_KEY in
    // the Vercel project's Environment Variables dashboard.
    if (empty(getenv('APP_KEY'))) {
        $ephemeralKey = 'base64:'.base64_encode(random_bytes(32));
        putenv('APP_KEY='.$ephemeralKey);
        $_ENV['APP_KEY'] = $ephemeralKey;
        $_SERVER['APP_KEY'] = $ephemeralKey;
    }
}

return $app;
