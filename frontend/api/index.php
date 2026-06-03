<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

echo '<pre>';

echo "Laravel version: ";
echo \Illuminate\Foundation\Application::VERSION;
echo PHP_EOL;

echo "packages.php: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/packages.php'));

echo "services.php: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/services.php'));

echo "Installed providers:" . PHP_EOL;

$providers = require __DIR__.'/../bootstrap/providers.php';

print_r($providers);

exit;
