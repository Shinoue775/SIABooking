<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class RoomController extends Controller
{
    public function index(SupabaseService $supabase): JsonResponse
    {
        try {
            $rooms = $supabase->listRooms();
            usort($rooms, [$this, 'sortRooms']);

            return response()->json($rooms);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function availability(Request $request, SupabaseService $supabase): JsonResponse
    {
        $date = (string) $request->query('date', '');

        if (! preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            return response()->json([
                'error' => 'Invalid date format. Use YYYY-MM-DD',
            ], 400);
        }

        try {
            $rooms = $supabase->listRooms();
            usort($rooms, [$this, 'sortRooms']);

            $dayStart = "{$date}T00:00:00";
            $dayEnd = "{$date}T23:59:59";

            $bookings = $supabase->listBookings([
                'status' => ['neq', 'cancelled'],
                'start_at' => ['lt', $dayEnd],
                'end_at' => ['gt', $dayStart],
            ]);

            $availability = array_map(function (array $room) use ($bookings) {
                $roomBookings = array_values(array_filter(
                    $bookings,
                    fn (array $booking) => (string) ($booking['room_id'] ?? '') === (string) ($room['id'] ?? ''),
                ));

                return [
                    ...$room,
                    'available' => $roomBookings === [],
                    'bookings' => array_map(static fn (array $booking) => [
                        'start_at' => $booking['start_at'] ?? null,
                        'end_at' => $booking['end_at'] ?? null,
                        'status' => $booking['status'] ?? null,
                    ], $roomBookings),
                ];
            }, $rooms);

            return response()->json([
                'date' => $date,
                'rooms' => $availability,
            ]);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    private function sortRooms(array $left, array $right): int
    {
        $leftLabel = (string) ($left['room_number'] ?? $left['number'] ?? $left['name'] ?? $left['id'] ?? '');
        $rightLabel = (string) ($right['room_number'] ?? $right['number'] ?? $right['name'] ?? $right['id'] ?? '');

        return strnatcasecmp($leftLabel, $rightLabel);
    }
}
