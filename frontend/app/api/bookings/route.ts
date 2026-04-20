import { z } from 'zod';
import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';

const bookingSchema = z.object({
  room_id: z.number().int().positive(),
  start_at: z.string().min(1, 'start_at is required'),
  end_at: z.string().min(1, 'end_at is required'),
  guests: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
  extra_beds: z.number().int().min(0).max(2).optional(),
  discount_type: z.enum(['none', 'pwd', 'senior']).optional(),
  total_price: z.number().positive().optional(),
});

// Allow both camelCase and snake_case payloads coming from the frontend
// and coerce numeric fields that may arrive as strings.
function normalizeBookingPayload(body: any) {
  const roomIdRaw = body.room_id ?? body.roomId;
  const startAt = body.start_at ?? body.startAt;
  const endAt = body.end_at ?? body.endAt;
  const guestsRaw = body.guests;
  const amenitiesRaw = body.amenities;
  const extraBedsRaw = body.extra_beds ?? body.extraBeds;
  const discountType = body.discount_type ?? body.discountType;
  const totalPriceRaw = body.total_price ?? body.totalPrice;

  return {
    room_id:
      typeof roomIdRaw === 'string'
        ? parseInt(roomIdRaw, 10)
        : roomIdRaw,
    start_at: startAt,
    end_at: endAt,
    guests:
      typeof guestsRaw === 'string'
        ? parseInt(guestsRaw, 10)
        : guestsRaw,
    amenities: Array.isArray(amenitiesRaw)
      ? amenitiesRaw.map((a) => String(a))
      : undefined,
    extra_beds:
      typeof extraBedsRaw === 'string'
        ? parseInt(extraBedsRaw, 10)
        : extraBedsRaw,
    discount_type: discountType,
    total_price:
      typeof totalPriceRaw === 'string'
        ? parseFloat(totalPriceRaw)
        : totalPriceRaw,
  };
}

//POST /api/bookings
export async function POST(request: Request) {
  const supabase = createServerSideClient();
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const normalized = normalizeBookingPayload(body);
    const result = bookingSchema.safeParse(normalized);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 }
      );
    }

    const { room_id, start_at, end_at, guests = 1, amenities, extra_beds, discount_type, total_price } = result.data;
    const { data: conflicts, error: confErr } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', room_id)
      .neq('status', 'cancelled')
      .lt('start_at', end_at)
      .gt('end_at', start_at);

    if (confErr) {
      return NextResponse.json({ error: confErr.message }, { status: 500 });
    }

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({ error: 'Room is not available for the selected time' }, { status: 409 });
    }

    // Build booking notes from extra details
    const notesObj: Record<string, any> = {};
    if (extra_beds && extra_beds > 0) notesObj.extra_beds = extra_beds;
    if (discount_type && discount_type !== 'none') notesObj.discount_type = discount_type;
    if (total_price) notesObj.total_price = total_price;
    const notesStr = Object.keys(notesObj).length > 0 ? JSON.stringify(notesObj) : undefined;

    const insertPayload: Record<string, any> = {
      user_id: user.id,
      room_id,
      start_at,
      end_at,
      guests,
      status: 'pending',
    };
    if (notesStr) insertPayload.notes = notesStr;

    // Try insert with notes first; if notes column doesn't exist, retry without it
    let bookingResult = await supabase
      .from('bookings')
      .insert(insertPayload)
      .select()
      .single();

    if (bookingResult.error && notesStr) {
      // Fallback: insert without notes if column doesn't exist
      const { notes: _n, ...basePayload } = insertPayload;
      bookingResult = await supabase
        .from('bookings')
        .insert(basePayload)
        .select()
        .single();
    }

    const { data: booking, error: bookingError } = bookingResult;

    if (bookingError) {
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    if (amenities && amenities.length > 0) {
      const bookingAmenities = amenities.map((amenityId: string) => {
        const parsedId = parseInt(amenityId, 10);
        if (isNaN(parsedId)) {
          throw new Error(`Invalid amenity ID: ${amenityId}`);
        }
        return {
          booking_id: booking.id,
          amenity_id: parsedId,
        };
      });

      const { error: amenityError } = await supabase
        .from('booking_amenities')
        .insert(bookingAmenities);

      if (amenityError) {
        return NextResponse.json({ error: amenityError.message }, { status: 500 });
      }
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const supabase = createServerSideClient();

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

  if (authErr || !user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  try {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (!profile || profile.role !== 'admin') {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
