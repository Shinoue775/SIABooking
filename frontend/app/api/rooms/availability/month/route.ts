import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';

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

        // Fetch all non-cancelled bookings that overlap with this month:
        // existing.start_at < rangeEnd AND existing.end_at > rangeStart
        const { data: bookings, error: bookErr } = await supabase
            .from('bookings')
            .select('start_at, end_at')
            .eq('room_id', roomId)
            .neq('status', 'cancelled')
            .lt('start_at', rangeEnd)
            .gt('end_at', rangeStart);

        if (bookErr) {
            return NextResponse.json({ error: bookErr.message }, { status: 500 });
        }

        // Mark every calendar day within each booking range as unavailable.
        // A day is unavailable from check-in day up to (but not including) check-out day.
        const unavailableDaysSet = new Set<number>();

        for (const b of bookings || []) {
            const startDate = new Date(b.start_at);
            const endDate = b.end_at ? new Date(b.end_at) : startDate;

            // Iterate day by day from start to end (exclusive) within the requested month
            const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate()));
            const endDay = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate()));

            while (cursor < endDay) {
                const cursorMonth = cursor.getUTCMonth() + 1;
                if (cursor.getUTCFullYear() === year && cursorMonth === month) {
                    unavailableDaysSet.add(cursor.getUTCDate());
                }
                cursor.setUTCDate(cursor.getUTCDate() + 1);
            }
        }

        const unavailableDays = Array.from(unavailableDaysSet).sort((a, b) => a - b);

        return NextResponse.json(
            { year, month, room_id: roomId, unavailableDays },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
