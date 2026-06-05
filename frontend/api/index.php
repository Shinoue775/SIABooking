<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

$configFile = __DIR__.'/../config/app.php';

echo "config file exists: ";
var_dump(file_exists($configFile));

echo "\n";

$config = require $configFile;

echo "config loaded: ";
var_dump(is_array($config));

echo "\n";

echo "config keys:\n";
print_r(array_keys($config));

exit;
