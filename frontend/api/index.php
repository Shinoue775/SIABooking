<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__.'/../vendor/autoload.php';

try {
    $app = require __DIR__.'/../bootstrap/app.php';

    echo "BOOTSTRAP OK";
} catch (Throwable $e) {
    echo "<pre>";
    echo get_class($e) . "\n\n";
    echo $e->getMessage() . "\n\n";
    echo $e->getFile() . ":" . $e->getLine();
}
