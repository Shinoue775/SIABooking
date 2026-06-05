<?php

require __DIR__.'/../vendor/autoload.php';

echo "<pre>";

echo "packages.php: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/packages.php'));

echo "services.php: ";
var_dump(file_exists(__DIR__.'/../bootstrap/cache/services.php'));

echo "\n";

if (file_exists(__DIR__.'/../bootstrap/cache/services.php')) {
    echo substr(
        file_get_contents(__DIR__.'/../bootstrap/cache/services.php'),
        0,
        500
    );
}

exit;
