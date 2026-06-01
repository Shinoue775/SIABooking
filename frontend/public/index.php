<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

echo "<pre>";

try {
    echo "config app exists: ";
    var_dump(file_exists(__DIR__.'/../config/app.php'));

    echo "config view exists: ";
    var_dump(file_exists(__DIR__.'/../config/view.php'));

    echo "base path: ";
    var_dump($app->basePath());

} catch (\Throwable $e) {
    echo $e->getMessage();
}

exit;

$app->handleRequest(Request::capture());
