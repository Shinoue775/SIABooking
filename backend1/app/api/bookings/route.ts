import { z } from 'zod';
import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

const bookingSchema = z.object({
  room_id: z.number().int().positive(),
  room_type: z.enum(['deluxe', 'standard']).optional(),
  start_at: z.string().min(1, 'start_at is required'),
  end_at: z.string().min(1, 'end_at is required'),
  guests: z.number().int().positive().optional(),
  amenities: z.array(z.string()).optional(),
  has_pwd: z.boolean().optional(),
  has_senior: z.boolean().optional(),
  has_child: z.boolean().optional(),
  child_age_group: z.enum(['under2', 'over2']).nullable().optional(),
  extra_beds: z.number().int().min(0).max(2).optional(),
  total_price: z.number().positive({ message: 'total_price is required and must be positive' }),
  payment_method: z.enum(['cash', 'gcash']).optional(),
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
  const totalPriceRaw = body.total_price ?? body.totalPrice;

  return {
    room_id:
      typeof roomIdRaw === 'string'
        ? parseInt(roomIdRaw, 10)
        : roomIdRaw,
    room_type: body.room_type ?? body.roomType ?? undefined,
    start_at: startAt,
    end_at: endAt,
    guests:
      typeof guestsRaw === 'string'
        ? parseInt(guestsRaw, 10)
        : guestsRaw,
    amenities: Array.isArray(amenitiesRaw)
      ? amenitiesRaw.map((a) => String(a))
      : undefined,
    has_pwd: body.has_pwd ?? body.hasPwd ?? undefined,
    has_senior: body.has_senior ?? body.hasSenior ?? undefined,
    has_child: body.has_child ?? body.hasChild ?? undefined,
    child_age_group: body.child_age_group ?? body.childAgeGroup ?? undefined,
    extra_beds:
      typeof extraBedsRaw === 'string'
        ? parseInt(extraBedsRaw, 10)
        : extraBedsRaw,
    total_price:
      typeof totalPriceRaw === 'string'
        ? parseFloat(totalPriceRaw)
        : totalPriceRaw,
    payment_method: body.payment_method ?? body.paymentMethod ?? undefined,
  };
}

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
    const normalized = normalizeBookingPayload(body);
    const result = bookingSchema.safeParse(normalized);

    if (!result.success) {
      return jsonWithCors(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 },
        request
      );
    }

    const { room_id, room_type, start_at, end_at, guests = 1, amenities, has_pwd, has_senior, has_child, child_age_group, extra_beds, total_price, payment_method } = result.data;

    if (has_pwd && has_senior) {
      return jsonWithCors({ error: 'Cannot apply both PWD and Senior discounts at the same time' }, { status: 400 }, request);
    }

    // Check for range-overlapping bookings: existing.start_at < new.end_at AND existing.end_at > new.start_at
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

    const insertPayload: Record<string, any> = {
      user_id: user.id,
      room_id,
      ...(room_type ? { room_type } : {}),
      start_at,
      end_at,
      guests,
      status: 'pending',
      has_child: has_child ?? false,
      child_age_group: has_child ? (child_age_group ?? null) : null,
      has_pwd: has_pwd ?? false,
      has_senior: has_senior ?? false,
      extra_beds: extra_beds ?? 0,
      price_at_booking: total_price,
      total_amount: total_price,
      ...(payment_method ? { payment_method: payment_method } : {}),
    };

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert(insertPayload)
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
