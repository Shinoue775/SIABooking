<?php

return [
    'allowed_origins' => env('API_ALLOWED_ORIGINS', 'https://sia-booking-lbtq.vercel.app,https://sia-backup.vercel.app,http://localhost:8000,http://127.0.0.1:8000'),
    'data_encryption_key' => env('DATA_ENCRYPTION_KEY', env('APP_KEY')),
];
