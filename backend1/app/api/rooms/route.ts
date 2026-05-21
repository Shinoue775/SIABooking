import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

export async function OPTIONS(request: Request) {
    return handleCors(request);
}

//GET /api/rooms 
export async function GET(request: Request) {
    const supabase = createServerSideClient();

    try {
        const { data, error } = await supabase
            .from('rooms')
            .select('*');

        if (error) {
            return jsonWithCors({ error: error.message }, { status: 500 }, request);
        }

        const sorted = (data || []).sort((left: any, right: any) => {
            const leftLabel = String(left.room_number || left.number || left.name || left.id || '');
            const rightLabel = String(right.room_number || right.number || right.name || right.id || '');
            return leftLabel.localeCompare(rightLabel, undefined, { numeric: true, sensitivity: 'base' });
        });

        return jsonWithCors(sorted, { status: 200 }, request);
    } catch (err: any) {
        return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
    }
}
