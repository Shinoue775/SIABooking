<?php

echo json_encode([
    'success' => true,
    'php' => PHP_VERSION,
]);

"routes": [
  {
    "src": "/test",
    "dest": "/api/test.php"
  },
  {
    "src": "/(.*)",
    "dest": "/api/index.php"
  }
]

