<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Services\SupabaseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class AuthController extends Controller
{
    public function register(RegisterUserRequest $request, SupabaseService $supabase): JsonResponse
    {
        try {
            $supabase->upsertUser($request->validated());

            return response()->json([
                'message' => 'User profile saved successfully.',
            ], 201);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }

    public function user(Request $request, SupabaseService $supabase): JsonResponse
    {
        $user = $request->attributes->get('auth.user');

        try {
            $profile = $supabase->findUserProfile($user['id']);

            if (! $profile) {
                return response()->json([
                    'id' => $user['id'],
                    'email' => $user['email'] ?? null,
                    'full_name' => data_get($user, 'user_metadata.full_name', ''),
                    'role' => 'user',
                ]);
            }

            return response()->json([
                ...$profile,
                'email' => $user['email'] ?? ($profile['email'] ?? null),
            ]);
        } catch (Throwable $throwable) {
            return response()->json([
                'error' => $throwable->getMessage(),
            ], 500);
        }
    }
}
