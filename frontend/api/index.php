<?php

use Illuminate\Http\Request;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

try {
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

    echo "KERNEL OK";
} catch (Throwable $e) {
    echo "<pre>";
    echo get_class($e) . "\n\n";
    echo $e->getMessage() . "\n\n";
    echo $e->getFile() . ":" . $e->getLine();
}
