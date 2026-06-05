<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

echo "base path:\n";
echo $app->basePath()."\n\n";

echo "config path:\n";
echo $app->configPath()."\n\n";

echo "providers path:\n";
echo $app->bootstrapPath()."/providers.php\n\n";

echo "app.php exists:\n";
var_dump(file_exists($app->configPath('app.php')));

echo "\nview.php exists:\n";
var_dump(file_exists($app->configPath('view.php')));

echo "\nservices.php exists:\n";
var_dump(file_exists($app->bootstrapPath('cache/services.php')));

echo "\npackages.php exists:\n";
var_dump(file_exists($app->bootstrapPath('cache/packages.php')));
