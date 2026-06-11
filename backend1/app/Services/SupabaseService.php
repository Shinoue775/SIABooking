<?php

namespace App\Services;

use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use RuntimeException;

class SupabaseService
{
    private const USER_ENCRYPTED_FIELDS = [
        'email',
        'full_name',
        'phone',
        'address',
    ];
    private const BOOKING_ENCRYPTED_FIELDS = [];

    public function __construct(
        private readonly HttpFactory $http,
        private readonly AesGcmCipher $cipher,
    ) {
    }

    public function authenticateToken(string $token): array
    {
        $response = $this->http->withHeaders([
            'apikey' => $this->serviceRoleKey(),
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ])->get($this->baseUrl() . '/auth/v1/user');

        if ($response->failed()) {
            throw new RuntimeException('Unable to authenticate token.');
        }

        return $response->json();
    }

    public function findUserProfile(string $userId): ?array
    {
        return $this->decryptFields($this->fetchSingle('users', [
            'id' => ['eq', $userId],
        ]), self::USER_ENCRYPTED_FIELDS);
    }

    public function upsertUser(array $payload): void
    {
        if (isset($payload['full_name']) || isset($payload['fname']) || isset($payload['lname'])) {
            $nameParts = preg_split('/\s+/', trim((string) ($payload['full_name'] ?? '')), 2) ?: [];
            $payload['fname'] = $payload['fname'] ?? ($nameParts[0] ?? 'Guest');
            $payload['lname'] = $payload['lname'] ?? ($nameParts[1] ?? 'User');
            unset($payload['full_name'], $payload['phone'], $payload['address']);
        }

        $payload = $this->encryptFields($payload, self::USER_ENCRYPTED_FIELDS);

        $response = $this->rest('POST', 'users', [
            'on_conflict' => 'id',
        ], [$payload], [
            'Prefer' => 'resolution=merge-duplicates,return=minimal',
        ]);

        $this->ensureSuccess($response, 'Unable to save user profile.');
    }

    public function listRooms(): array
    {
        $response = $this->rest('GET', 'rooms', [
            'select' => '*,room_types(id,name,description,capacity,base_price)',
        ], null, [
            'Accept' => 'application/json',
        ]);

        $this->ensureSuccess($response, 'Unable to load rooms.');

        return $response->json() ?? [];
    }

    public function listBookings(array $filters = [], ?string $order = null): array
    {
        $query = array_merge($this->buildFilters($filters), [
            'select' => '*',
        ]);

        if ($order) {
            $query['order'] = $order;
        }

        $response = $this->rest('GET', 'bookings', $query);
        $this->ensureSuccess($response, 'Unable to load bookings.');

        return $response->json() ?? [];
    }

    public function createBooking(array $payload): array
    {
        // No encryption for booking fields — plain values for readability and consistency
        $response = $this->rest('POST', 'bookings', [], [$payload], [
            'Prefer' => 'return=representation',
        ]);

        $this->ensureSuccess($response, 'Unable to create booking.');

        return Arr::first($response->json() ?? []) ?? [];
    }

    public function createBookingAmenities(array $payload): void
    {
        $response = $this->rest('POST', 'booking_amenities', [], $payload, [
            'Prefer' => 'return=minimal',
        ]);

        $this->ensureSuccess($response, 'Unable to save booking amenities.');
    }

    public function findBooking(string $id): ?array
    {
        return $this->decryptFields($this->fetchSingle('bookings', [
            'id' => ['eq', $id],
        ]), self::BOOKING_ENCRYPTED_FIELDS);
    }

    public function updateBooking(string $id, array $payload): array
    {
        $payload = $this->encryptFields($payload, self::BOOKING_ENCRYPTED_FIELDS);
        $response = $this->rest('PATCH', 'bookings', $this->buildFilters([
            'id' => ['eq', $id],
        ]), $payload, [
            'Prefer' => 'return=representation',
        ]);

        $this->ensureSuccess($response, 'Unable to update booking.');

        return $this->decryptFields(Arr::first($response->json() ?? []) ?? [], self::BOOKING_ENCRYPTED_FIELDS);
    }

    public function bookingSchema(): array
    {
        $response = $this->rest('GET', 'information_schema.columns', [
            'select' => 'column_name,data_type,is_nullable,ordinal_position',
            'table_schema' => 'eq.public',
            'table_name' => 'eq.bookings',
            'order' => 'ordinal_position.asc',
        ]);

        $this->ensureSuccess($response, 'Unable to load booking schema.');

        return $response->json() ?? [];
    }

    private function fetchSingle(string $table, array $filters): ?array
    {
        $response = $this->rest('GET', $table, array_merge($this->buildFilters($filters), [
            'select' => '*',
        ]), null, [
            'Accept' => 'application/vnd.pgrst.object+json',
        ]);

        if ($response->status() === 406) {
            return null;
        }

        $this->ensureSuccess($response, "Unable to fetch {$table} record.");

        return $response->json();
    }

    private function encryptFields(array $payload, array $fields): array
    {
        foreach ($fields as $field) {
            if (!array_key_exists($field, $payload) || $payload[$field] === null) {
                continue;
            }

            $payload[$field] = $this->cipher->encrypt($payload[$field]);
        }

        return $payload;
    }

    private function decryptFields(?array $payload, array $fields): ?array
    {
        if ($payload === null) {
            return null;
        }

        foreach ($fields as $field) {
            if (!array_key_exists($field, $payload) || !is_string($payload[$field])) {
                continue;
            }

            try {
                $payload[$field] = $this->cipher->decrypt($payload[$field]);
            } catch (\InvalidArgumentException) {
                continue;
            }
        }

        return $payload;
    }

    private function rest(
        string $method,
        string $table,
        array $query = [],
        mixed $body = null,
        array $headers = [],
    ): Response {
        $request = $this->http->withHeaders(array_merge([
            'apikey' => $this->serviceRoleKey(),
            'Authorization' => 'Bearer ' . $this->serviceRoleKey(),
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ], $headers));

        return $request->send($method, $this->baseUrl() . '/rest/v1/' . $table, [
            'query' => $query,
            'json' => $body,
        ]);
    }

    private function buildFilters(array $filters): array
    {
        $query = [];

        foreach ($filters as $column => $filter) {
            [$operator, $value] = $filter;
            $query[$column] = "{$operator}.{$value}";
        }

        return $query;
    }

    private function ensureSuccess(Response $response, string $message): void
    {
        if ($response->successful()) {
            return;
        }

        $error = $response->json('message')
            ?? $response->json('error')
            ?? $response->body()
            ?? $message;

        throw new RuntimeException($error ?: $message);
    }

    private function baseUrl(): string
    {
        $url = rtrim((string) config('services.supabase.url'), '/');

        if ($url === '') {
            throw new RuntimeException('SUPABASE_URL is not configured.');
        }

        return $url;
    }

    private function serviceRoleKey(): string
    {
        $key = (string) config('services.supabase.service_role_key');

        if ($key === '') {
            throw new RuntimeException('SUPABASE_SERVICE_ROLE_KEY is not configured.');
        }

        return $key;
    }
}
