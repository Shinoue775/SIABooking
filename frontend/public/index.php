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

echo "__DIR__:\n";
var_dump(__DIR__);

echo "\n";

echo "basePath:\n";
var_dump($app->basePath());

echo "\n";

echo "config path:\n";
var_dump($app->configPath());

echo "\n";

echo "resource path:\n";
var_dump(resource_path());

echo "\n";

echo "storage path:\n";
var_dump(storage_path());

exit;

$app->handleRequest(Request::capture());
