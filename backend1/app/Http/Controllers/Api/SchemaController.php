<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class SchemaController extends Controller
{
    public function __invoke(Request $request, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');

        try {
            $profile = $supabase->findUserProfile($user['id']);

            if (($profile['role'] ?? null) !== 'admin') {
                return response()->json([
                    'error' => 'Forbidden',
                ], 403);
            }

            return response()->json([
                'table' => 'bookings',
                'columns' => $supabase->bookingSchema(),
            ]);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }
}
