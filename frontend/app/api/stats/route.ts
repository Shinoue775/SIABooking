import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';

// GET /api/stats - returns live counts for the home page hero section
export async function GET() {
    const supabase = createServerSideClient();

    try {
        const [roomsResult, guestsResult] = await Promise.all([
            supabase.from('rooms').select('id', { count: 'exact', head: true }),
            supabase.from('bookings').select('user_id'),
        ]);

        const roomCount = roomsResult.count ?? 0;
        const uniqueGuestIds = new Set((guestsResult.data ?? []).map((b: any) => b.user_id));
        const guestCount = uniqueGuestIds.size;

        return NextResponse.json({ roomCount, guestCount }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
