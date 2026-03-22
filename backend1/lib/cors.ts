import { NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
    'https://sia-backup.vercel.app ',
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
