<?php

require __DIR__.'/../vendor/autoload.php';

echo '<pre>';

echo "vendor exists: ";
var_dump(is_dir(__DIR__.'/../vendor'));

echo "package manifest class exists: ";
var_dump(class_exists(\Illuminate\Foundation\PackageManifest::class));

echo "installed.php exists: ";
var_dump(file_exists(__DIR__.'/../vendor/composer/installed.php'));

echo "installed.json exists: ";
var_dump(file_exists(__DIR__.'/../vendor/composer/installed.json'));

exit;
