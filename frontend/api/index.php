<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

echo "APP CLASS:\n";
var_dump(get_class($app));

echo "\n";

echo "CONFIG EXISTS:\n";
var_dump(class_exists(\Illuminate\Config\Repository::class));

echo "\n";

echo "BOOTSTRAP PROVIDERS FILE EXISTS:\n";
var_dump(file_exists(__DIR__.'/../bootstrap/providers.php'));

echo "\n";

echo "APP CONFIG EXISTS:\n";
var_dump(file_exists(__DIR__.'/../config/app.php'));

echo "\n";

try {
    $kernel = $app->make(
        Illuminate\Contracts\Http\Kernel::class
    );

    echo "KERNEL RESOLVED\n";

    echo "config bound after kernel:\n";
    var_dump($app->bound('config'));

    echo "view bound after kernel:\n";
    var_dump($app->bound('view'));

} catch (\Throwable $e) {
    echo $e->getMessage();
}
