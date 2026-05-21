import { NextResponse } from 'next/server';

// Origins that are allowed to call the backend API.
// The primary frontend is SiaBookingMigrated-main deployed at sia-booking-lbtq.vercel.app.
const ALLOWED_ORIGINS = [
    'https://sia-booking-lbtq.vercel.app',
    'https://sia-backup.vercel.app',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
];

export function corsHeaders(origin?: string | null): Record<string, string> {
    const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]!;
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
    };
}

export function handleCors(request: Request) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: corsHeaders(origin),
    });
}

export function jsonWithCors(data: unknown, init: { status?: number } = {}, request?: Request) {
    const origin = request?.headers.get('origin');
    return NextResponse.json(data, {
        status: init.status || 200,
        headers: corsHeaders(origin),
    });
}
