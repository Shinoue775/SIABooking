import { z } from 'zod';
import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';
const bookingSchema = z.object({
  room_id: z.number().int().positive(),
  start_at: z.string().min(1, 'start_at is required'),
  end_at: z.string().min(1, 'end_at is required'),
  guests: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
});

export async function OPTIONS(request: Request) {
  return handleCors(request);
}

//POST /api/bookings
export async function POST(request: Request) {
  const supabase = createServerSideClient();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonWithCors({ error: 'Authorization header required' }, { status: 401 }, request);
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return jsonWithCors({ error: 'Invalid or expired token' }, { status: 401 }, request);
  }

  try {
    const body = await request.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return jsonWithCors(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 },
        request
      );
    }

    const { room_id, start_at, end_at, guests = 1, amenities } = result.data;
    const { data: conflicts, error: confErr } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .neq('status', 'cancelled')
      .lt('start_at', end_at)
      .gt('end_at', start_at);

    if (confErr) {
      return jsonWithCors({ error: confErr.message }, { status: 500 }, request);
    }

    if (conflicts && conflicts.length > 0) {
      return jsonWithCors({ error: 'Room is not available for the selected time' }, { status: 409 }, request);
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id,
        start_at,
        end_at,
        guests,
        status: 'pending',
      })
      .select()
      .single();
//amenities using str
    if (bookingError) {
      return jsonWithCors({ error: bookingError.message }, { status: 500 }, request);
    }
    if (amenities && amenities.length > 0) {

      const bookingAmenities = amenities.map((amenityId: string) => ({
        booking_id: booking.id,
        amenity_id: parseInt(amenityId),
      }));

      const { error: amenityError } = await supabase
        .from('booking_amenities')
        .insert(bookingAmenities);

      if (amenityError) {
        return jsonWithCors({ error: amenityError.message }, { status: 500 }, request);
      }
    }

    return jsonWithCors(booking, { status: 201 }, request);


  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}

export async function GET(request: Request) {
  const supabase = createServerSideClient();

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return jsonWithCors({ error: 'Authorization header required' }, { status: 401 }, request);
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return jsonWithCors({ error: 'Invalid or expired token' }, { status: 401 }, request);
  }

  try {
    //admin view
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    // User View
    if (!profile || profile.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      return jsonWithCors({ error: error.message }, { status: 500 }, request);
    }

    return jsonWithCors(data, { status: 200 }, request);
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}
