<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

echo "config repository bound before bootstrap: ";
var_dump($app->bound('config'));

echo "\n";

$kernel = $app->make(
    Illuminate\Contracts\Http\Kernel::class
);

echo "kernel resolved\n";

echo "config repository bound after kernel: ";
var_dump($app->bound('config'));

echo "\n";

try {

    $config = $app->make('config');

    echo "CONFIG RESOLVED\n";

} catch (Throwable $e) {

    echo "CONFIG FAILED\n";
    echo $e->getMessage();

}

exit;
