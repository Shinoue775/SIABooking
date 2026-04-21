import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';
export async function OPTIONS(request: Request) {
    return handleCors(request);
}

//GET /api/rooms/availability
export async function GET(request: Request) {
    const supabase = createServerSideClient();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
        return jsonWithCors({ error: 'date query parameter is required (YYYY-MM-DD)' }, { status: 400 }, request);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return jsonWithCors({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 }, request);
    }

    try {
        const dayStart = `${date}T00:00:00`;
        const dayEnd = `${date}T23:59:59`;
        let rooms: any[] = [];
        const { data: roomData, error: roomErr } = await supabase
            .from('rooms')
            .select('*');

        if (roomErr) {
            rooms = [
                { id: '1', name: 'Room A', floor: '6th floor', number: '601', type: 'Premium' },
                { id: '2', name: 'Room B', floor: '6th floor', number: '602', type: 'Standard' },
            ];
        } else {
            rooms = (roomData || []).sort((left, right) => {
                const leftLabel = String(left.room_number || left.number || left.name || left.id || '');
                const rightLabel = String(right.room_number || right.number || right.name || right.id || '');
                return leftLabel.localeCompare(rightLabel, undefined, { numeric: true, sensitivity: 'base' });
            });
        }
        const { data: bookings, error: bookErr } = await supabase
            .from('archived_bookings')
            .select('*')
            .neq('status', 'cancelled')
            .lt('start_at', dayEnd)
            .gt('end_at', dayStart);

        if (bookErr) {
            return jsonWithCors({ error: bookErr.message }, { status: 500 }, request);
        }
        const availability = rooms.map((room) => {
            const roomBookings = (bookings || []).filter((b) => b.room_id === room.id);
            return {
                ...room,
                available: roomBookings.length === 0,
                bookings: roomBookings.map((b) => ({
                    start_at: b.start_at,
                    end_at: b.end_at,
                    status: b.status,
                })),
            };
        });

        return jsonWithCors({ date, rooms: availability }, { status: 200 }, request);
    } catch (err: any) {
        return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
    }
}
