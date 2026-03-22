import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';

//GET /api/rooms
export async function GET() {
    const supabase = createServerSideClient();

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const sorted = (data || []).sort((left: any, right: any) => {
            const leftLabel = String(left.room_number || left.number || left.name || left.id || '');
            const rightLabel = String(right.room_number || right.number || right.name || right.id || '');
            return leftLabel.localeCompare(rightLabel, undefined, { numeric: true, sensitivity: 'base' });
        });

        // If no rooms in database, return test rooms for UI with standard IDs (1, 2)
        if (sorted.length === 0) {
            return NextResponse.json([
                { id: 1, room_number: '1', name: 'Room A' },
                { id: 2, room_number: '2', name: 'Room B' }
            ], { status: 200 });
        }

        return NextResponse.json(sorted, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
    }
}
