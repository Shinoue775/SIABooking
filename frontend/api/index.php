<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(
    Illuminate\Contracts\Http\Kernel::class
);

$request = Illuminate\Http\Request::capture();

try {
    $kernel->bootstrap();

    echo "<pre>";

    echo "config bound: ";
    var_dump($app->bound('config'));

    echo "\n";

    echo "view bound: ";
    var_dump($app->bound('view'));

    echo "\n";

    echo "app env: ";
    var_dump(config('app.env'));

} catch (\Throwable $e) {
    echo get_class($e);
    echo "\n\n";
    echo $e->getMessage();
    echo "\n\n";
    echo $e->getFile();
    echo ':';
    echo $e->getLine();
}
