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

echo "cache dir exists: ";
var_dump(is_dir(__DIR__.'/../bootstrap/cache'));

echo "cache dir contents:\n";
print_r(scandir(__DIR__.'/../bootstrap/cache'));

var_dump(file_exists(base_path('package-discovery-test.txt')));

exit;

$app->handleRequest(Request::capture());
