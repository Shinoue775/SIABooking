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

echo "Laravel version: ";
echo $app->version();
echo "\n\n";

echo "Has config repository: ";
var_dump($app->bound('config'));

echo "Loaded config app name: ";

try {
    var_dump(config('app.name'));
} catch (\Throwable $e) {
    echo $e->getMessage();
}

exit;

$app->handleRequest(Request::capture());
