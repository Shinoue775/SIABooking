<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

echo "view bound: ";
var_dump($app->bound('view'));

echo "\n";

echo "router bound: ";
var_dump($app->bound('router'));

echo "\n";

echo "config bound: ";
var_dump($app->bound('config'));

exit;
