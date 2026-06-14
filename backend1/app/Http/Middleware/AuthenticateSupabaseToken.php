<?php

namespace App\Http\Middleware;

use App\Services\SupabaseService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class AuthenticateSupabaseToken
{
    public function __construct(
        private readonly SupabaseService $supabase,
    ) {
    }

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json([
                'error' => 'Authorization header required',
            ], 401);
        }

        try {
            $user = $this->supabase->authenticateToken($token);
        } catch (Throwable) {
            return response()->json([
                'error' => 'Invalid or expired token',
            ], 401);
        }

        $request->attributes->set('auth.user', $user);

        return $next($request);
    }
}
