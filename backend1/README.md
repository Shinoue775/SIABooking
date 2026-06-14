# backend1 Laravel API

`backend1/` is now a standalone Laravel API for the SIABooking booking service.

## Local setup

```bash
cd backend1
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --host=127.0.0.1 --port=3001
```

## Required environment variables

- `APP_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `API_ALLOWED_ORIGINS`
- `DATA_ENCRYPTION_KEY` (optional; defaults to `APP_KEY`)

## API routes

- `GET /api/rooms`
- `GET /api/rooms/availability?date=YYYY-MM-DD`
- `POST /api/auth/register`
- `GET /api/auth/user`
- `GET /api/bookings`
- `POST /api/bookings`
- `PATCH /api/bookings/{id}`
- `DELETE /api/bookings/{id}`
- `GET /api/schema` (admin only)

## Encryption

Backend-managed encrypted payloads use AES-256-GCM via `App\Services\AesGcmCipher`.
