<?php

namespace Tests\Feature;

use App\Services\SupabaseService;
use Illuminate\Support\Str;
use Tests\TestCase;

class ApiRoutesTest extends TestCase
{
    private const AUTHORIZATION_HEADER = 'Bearer'.' test-token';

    public function test_rooms_endpoint_returns_sorted_rooms(): void
    {
        $this->instance(SupabaseService::class, new FakeSupabaseService([
            'rooms' => [
                ['id' => 3, 'room_number' => '12'],
                ['id' => 2, 'room_number' => '2'],
                ['id' => 1, 'room_number' => '1'],
            ],
        ]));

        $response = $this->getJson('/api/rooms');

        $response->assertOk()
            ->assertJsonPath('0.room_number', '1')
            ->assertJsonPath('1.room_number', '2')
            ->assertJsonPath('2.room_number', '12');
    }

    public function test_rooms_endpoint_normalizes_plain_supabase_room_rows(): void
    {
        $this->instance(SupabaseService::class, new FakeSupabaseService([
            'rooms' => [
                ['id' => 10, 'room_type_id' => 1, 'room_number' => '101', 'status' => 'available'],
                ['id' => 11, 'room_type_id' => 2, 'room_number' => '102', 'status' => 'available'],
            ],
        ]));

        $response = $this->getJson('/api/rooms');

        $response->assertOk()
            ->assertJsonPath('0.id', 10)
            ->assertJsonPath('0.type', 'standard')
            ->assertJsonPath('0.name', 'Standard Room 101')
            ->assertJsonPath('1.id', 11)
            ->assertJsonPath('1.type', 'deluxe')
            ->assertJsonPath('1.name', 'Deluxe Room 102');
    }

    public function test_booking_endpoint_accepts_camel_case_payload_and_enforces_auth(): void
    {
        $service = new FakeSupabaseService([
            'authUser' => ['id' => 'user-1', 'email' => 'guest@example.com'],
            'profiles' => [
                'user-1' => ['id' => 'user-1', 'role' => 'guest'],
            ],
        ]);

        $this->instance(SupabaseService::class, $service);

        $response = $this->postJson('/api/bookings', [
            'roomId' => 4,
            'startAt' => '2026-06-01T14:00:00+00:00',
            'endAt' => '2026-06-02T12:00:00+00:00',
            'guests' => '2',
            'amenities' => ['1', '2'],
            'totalPrice' => '1250.50',
            'amountPaid' => '625.25',
            'balanceDue' => '625.25',
            'paymentChoice' => 'partial',
        ], [
            'Authorization' => self::AUTHORIZATION_HEADER,
        ]);

        $response->assertCreated()
            ->assertJsonPath('room_id', 4)
            ->assertJsonPath('total_amount', 1250.5);

        $this->assertSame(4, $service->createdBooking['room_id']);
        $this->assertSame('2026-06-01T14:00:00+00:00', $service->createdBooking['start_at']);
        $this->assertSame(2, $service->createdBooking['guests']);
        $this->assertSame(625.25, $service->createdBooking['amount_paid']);
        $this->assertSame(625.25, $service->createdBooking['balance_due']);
        $this->assertSame('partial', $service->createdBooking['payment_choice']);
        $this->assertSame([
            ['booking_id' => 'booking-123', 'amenity_id' => 1],
            ['booking_id' => 'booking-123', 'amenity_id' => 2],
        ], $service->createdAmenities);
    }

    public function test_booking_endpoint_rejects_invalid_date_order(): void
    {
        $this->instance(SupabaseService::class, new FakeSupabaseService([
            'authUser' => ['id' => 'user-1', 'email' => 'guest@example.com'],
        ]));

        $response = $this->postJson('/api/bookings', [
            'room_id' => 4,
            'start_at' => '2026-06-03T14:00:00+00:00',
            'end_at' => '2026-06-02T12:00:00+00:00',
            'total_price' => 1000,
        ], [
            'Authorization' => self::AUTHORIZATION_HEADER,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_at']);
    }

    public function test_auth_user_endpoint_returns_fallback_profile(): void
    {
        $this->instance(SupabaseService::class, new FakeSupabaseService([
            'authUser' => [
                'id' => (string) Str::uuid(),
                'email' => 'guest@example.com',
                'user_metadata' => ['full_name' => 'Guest User'],
            ],
        ]));

        $response = $this->getJson('/api/auth/user', [
            'Authorization' => self::AUTHORIZATION_HEADER,
        ]);

        $response->assertOk()
            ->assertJsonPath('email', 'guest@example.com')
            ->assertJsonPath('full_name', 'Guest User')
            ->assertJsonPath('role', 'user');
    }

    public function test_schema_endpoint_requires_admin_role(): void
    {
        $this->instance(SupabaseService::class, new FakeSupabaseService([
            'authUser' => ['id' => 'user-1', 'email' => 'guest@example.com'],
            'profiles' => [
                'user-1' => ['id' => 'user-1', 'role' => 'guest'],
            ],
        ]));

        $response = $this->getJson('/api/schema', [
            'Authorization' => self::AUTHORIZATION_HEADER,
        ]);

        $response->assertForbidden();
    }
}

class FakeSupabaseService extends SupabaseService
{
    public ?array $createdBooking = null;

    public array $createdAmenities = [];

    public function __construct(private readonly array $state = [])
    {
    }

    public function authenticateToken(string $token): array
    {
        return $this->state['authUser'] ?? throw new \RuntimeException('Unauthenticated');
    }

    public function findUserProfile(string $userId): ?array
    {
        return $this->state['profiles'][$userId] ?? null;
    }

    public function upsertUser(array $payload): void
    {
    }

    public function listRooms(): array
    {
        return $this->state['rooms'] ?? [];
    }

    public function listBookings(array $filters = [], ?string $order = null): array
    {
        return $this->state['bookings'] ?? [];
    }

    public function createBooking(array $payload): array
    {
        $this->createdBooking = $payload;

        return [
            'id' => 'booking-123',
            ...$payload,
        ];
    }

    public function createBookingAmenities(array $payload): void
    {
        $this->createdAmenities = $payload;
    }

    public function findBooking(string $id): ?array
    {
        return $this->state['booking'] ?? null;
    }

    public function updateBooking(string $id, array $payload): array
    {
        return [
            'id' => $id,
            ...($this->state['booking'] ?? []),
            ...$payload,
        ];
    }

    public function bookingSchema(): array
    {
        return $this->state['schema'] ?? [];
    }
}
