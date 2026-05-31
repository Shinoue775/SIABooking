<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleApiCors
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isMethod('OPTIONS')) {
            return $this->withCorsHeaders(response()->noContent(204), $request);
        }

        return $this->withCorsHeaders($next($request), $request);
    }

    private function withCorsHeaders(Response $response, Request $request): Response
    {
        $origin = $request->headers->get('Origin');
        $allowedOrigin = $this->resolveOrigin($origin);

        $response->headers->set('Access-Control-Allow-Origin', $allowedOrigin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Encrypted-Payload');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Vary', 'Origin');

        return $response;
    }

    private function resolveOrigin(?string $origin): string
    {
        $allowedOrigins = array_values(array_filter(array_map(
            static fn (string $value) => trim($value),
            explode(',', (string) config('siabooking.allowed_origins')),
        )));

        if ($origin && in_array($origin, $allowedOrigins, true)) {
            return $origin;
        }

        return $allowedOrigins[0] ?? '*';
    }
}
