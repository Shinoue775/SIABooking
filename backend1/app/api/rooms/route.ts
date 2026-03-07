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
            .select('*')
            .order('name');

        if (error) {
            // hard coded incase
            if (error.code === '42P01' || error.message.includes('does not exist')) {
                return jsonWithCors([
                    {
                        id: '1',
                        name: 'Room A',
                        floor: '6th floor',
                        number: '601',
                        type: 'Premium',
                        capacity: 10,
                        amenities: ['Free WiFi', 'Breakfast', 'Private Bath', 'Smart TV'],
                        description: 'A spacious, premium room designed for relaxation and productivity.',
                    },
                    {
                        id: '2',
                        name: 'Room B',
                        floor: '6th floor',
                        number: '602',
                        type: 'Standard',
                        capacity: 8,
                        amenities: ['Free WiFi', 'Coffee Maker', 'Private Bath', 'LED TV'],
                        description: 'A comfortable standard room with clean, efficient layout.',
                    },
                ], { status: 200 }, request);
            } 

            return jsonWithCors({ error: error.message }, { status: 500 }, request);
        }

        return jsonWithCors(data, { status: 200 }, request);
    } catch (err: any) {
        return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
    }
}
