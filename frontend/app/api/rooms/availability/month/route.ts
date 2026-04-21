import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';
import { resolveBookingColumns, col } from '@/lib/schema';

// GET /api/rooms/availability/month?year=YYYY&month=M&room_id=N
// Returns the day numbers (1–31) that are booked for the given room in the given month.
export async function GET(request: Request) {
    const supabase = createServerSideClient();
    const { searchParams } = new URL(request.url);
    const yearStr = searchParams.get('year');
    const monthStr = searchParams.get('month'); // 1-indexed (1 = January)
    const roomIdStr = searchParams.get('room_id');

    if (!yearStr || !monthStr || !roomIdStr) {
        return NextResponse.json(
            { error: 'year, month (1–12), and room_id are required' },
            { status: 400 }
        );
    }

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1–12
    const roomId = parseInt(roomIdStr, 10);

    if (isNaN(year) || isNaN(month) || isNaN(roomId) || month < 1 || month > 12) {
        return NextResponse.json({ error: 'Invalid year, month, or room_id' }, { status: 400 });
    }

    try {
        // Build the UTC timestamp range that covers the entire requested month.
        const monthPadded = String(month).padStart(2, '0');
        const nextMonth = month === 12 ? 1 : month + 1;
        const nextYear = month === 12 ? year + 1 : year;

        const rangeStart = `${year}-${monthPadded}-01T00:00:00.000Z`;
        const rangeEnd = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01T00:00:00.000Z`;

        const colMap = await resolveBookingColumns(supabase);
        const startCol = col(colMap, 'start_at');

        // Fetch all non-cancelled bookings whose check-in falls within this month.
        const { data: bookings, error: bookErr } = await supabase
            .from('bookings')
            .select(startCol)
            .eq('room_id', roomId)
            .neq('status', 'cancelled')
            .gte(startCol, rangeStart)
            .lt(startCol, rangeEnd);

        if (bookErr) {
            return NextResponse.json({ error: bookErr.message }, { status: 500 });
        }

        // Extract the UTC day of each booking's check-in date.
        // Check-in is set to 3 PM local time → typically 7 AM UTC for UTC+8 (Philippines),
        // so the UTC date matches the local calendar date.
        const unavailableDays = [...new Set(
            (bookings || []).map((b) => new Date((b as any)[startCol]).getUTCDate())
        )].sort((a, b) => a - b);

        return NextResponse.json(
            { year, month, room_id: roomId, unavailableDays },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
