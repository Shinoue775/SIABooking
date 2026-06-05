<?php

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

echo "bootstrap cache writable: ";
var_dump(is_writable(__DIR__.'/../bootstrap/cache'));

echo "\n";

echo "bootstrap cache exists: ";
var_dump(is_dir(__DIR__.'/../bootstrap/cache'));

echo "\n";

echo "services.php exists: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/services.php'));

echo "\n";

echo "packages.php exists: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/packages.php'));

exit;
