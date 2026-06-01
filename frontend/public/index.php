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

echo "view: ";
var_dump($app->bound('view'));

echo "router: ";
var_dump($app->bound('router'));

echo "events: ";
var_dump($app->bound('events'));

echo "config: ";
var_dump($app->bound('config'));

echo "files: ";
var_dump($app->bound('files'));

exit;

$app->handleRequest(Request::capture());
