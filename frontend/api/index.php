<?php

require __DIR__.'/../vendor/autoload.php';

$app = require __DIR__.'/../bootstrap/app.php';

echo "<pre>";

try {

    $providers = require __DIR__.'/../bootstrap/cache/services.php';

    foreach ($providers['providers'] as $provider) {

        echo "REGISTERING: $provider\n";

        $instance = new $provider($app);

        $instance->register();

        echo "OK\n";
    }

} catch (\Throwable $e) {

    echo "\nFAILED PROVIDER:\n";
    echo $provider . "\n\n";

    echo get_class($e) . "\n";
    echo $e->getMessage() . "\n\n";

    echo $e->getFile() . ':' . $e->getLine();

}

exit;
