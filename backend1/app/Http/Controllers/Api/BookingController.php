<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingStatusRequest;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Throwable;

class BookingController extends Controller
{
    public function index(Request $request, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');

        try {
            $profile = $supabase->findUserProfile($user['id']);
            $filters = [];

            if (($profile['role'] ?? null) !== 'admin') {
                $filters['user_id'] = ['eq', $user['id']];
            }

            $bookings = $supabase->listBookings($filters, 'created_at.desc');

            return response()->json($bookings);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function store(StoreBookingRequest $request, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');
        $payload = $request->validatedPayload();

        try {
            $conflicts = $supabase->listBookings([
                'room_id' => ['eq', $payload['room_id']],
                'status' => ['neq', 'cancelled'],
                'start_at' => ['lt', $payload['end_at']],
                'end_at' => ['gt', $payload['start_at']],
            ]);

            if ($conflicts !== []) {
                return response()->json([
                    'error' => 'Room is not available for the selected time',
                ], 409);
            }

            $bookingPayload = Arr::whereNotNull([
                'user_id' => $user['id'],
                'room_id' => $payload['room_id'],
                'room_type' => $payload['room_type'] ?? null,
                'start_at' => $payload['start_at'],
                'end_at' => $payload['end_at'],
                'guests' => $payload['guests'] ?? 1,
                'status' => 'pending',
                'has_child' => $payload['has_child'] ?? false,
                'child_age_group' => ($payload['has_child'] ?? false)
                    ? ($payload['child_age_group'] ?? null)
                    : null,
                'has_pwd' => $payload['has_pwd'] ?? false,
                'has_senior' => $payload['has_senior'] ?? false,
                'extra_beds' => $payload['extra_beds'] ?? 0,
                'price_at_booking' => $payload['total_price'],
                'total_amount' => $payload['total_price'],
                'payment_method' => $payload['payment_method'] ?? null,
            ]);

            $booking = $supabase->createBooking($bookingPayload);

            $amenities = $payload['amenities'] ?? [];

            if ($amenities !== []) {
                $supabase->createBookingAmenities(array_map(
                    fn (int $amenityId) => [
                        'booking_id' => $booking['id'],
                        'amenity_id' => $amenityId,
                    ],
                    $amenities,
                ));
            }

            return response()->json($booking, 201);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function update(UpdateBookingStatusRequest $request, string $id, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');
        $status = $request->validated('status');

        try {
            $booking = $supabase->findBooking($id);

            if (! $booking) {
                return response()->json([
                    'error' => 'Booking not found',
                ], 404);
            }

            $profile = $supabase->findUserProfile($user['id']);
            $isAdmin = ($profile['role'] ?? null) === 'admin';
            $isOwner = ($booking['user_id'] ?? null) === $user['id'];

            if (! $isAdmin) {
                if (! $isOwner) {
                    return response()->json([
                        'error' => 'Forbidden',
                    ], 403);
                }

                if ($status !== 'cancelled') {
                    return response()->json([
                        'error' => 'Users may only cancel their own bookings',
                    ], 403);
                }
            }

            $updated = $supabase->updateBooking($id, ['status' => $status]);

            return response()->json($updated);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, string $id, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');

        try {
            $booking = $supabase->findBooking($id);

            if (! $booking) {
                return response()->json([
                    'error' => 'Booking not found',
                ], 404);
            }

            $profile = $supabase->findUserProfile($user['id']);
            $isAdmin = ($profile['role'] ?? null) === 'admin';
            $isOwner = ($booking['user_id'] ?? null) === $user['id'];

            if (! $isAdmin && ! $isOwner) {
                return response()->json([
                    'error' => 'Forbidden',
                ], 403);
            }

            $cancelled = $supabase->updateBooking($id, ['status' => 'cancelled']);

            return response()->json($cancelled);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }
}
