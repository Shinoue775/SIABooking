<?php

use Illuminate\Http\Request;

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

try {
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

    $request = Request::capture();

    $response = $kernel->handle($request);

    echo "REQUEST HANDLED OK<br>";
    echo "STATUS: ".$response->getStatusCode();

} catch (Throwable $e) {

    echo "<pre>";
    echo "EXCEPTION:\n";
    echo get_class($e)."\n\n";
    echo $e->getMessage()."\n\n";
    echo $e->getFile().":".$e->getLine()."\n\n";
    echo $e->getTraceAsString();
}
