import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

type Params = Promise<{ id: string }>;

export async function OPTIONS(request: Request) {
  return handleCors(request);
}

// PATCH /api/bookings/:id — update booking status
export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  const { id } = await params;
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
    const { status } = body;

    const validStatuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return jsonWithCors({ error: 'Invalid status. Must be one of: pending, confirmed, rejected, cancelled' }, { status: 400 }, request);
    }

    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !booking) {
      return jsonWithCors({ error: 'Booking not found' }, { status: 404 }, request);
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = booking.user_id === user.id;

    if (!isAdmin) {
      if (!isOwner) {
        return jsonWithCors({ error: 'Forbidden' }, { status: 403 }, request);
      }
      if (status !== 'cancelled') {
        return jsonWithCors({ error: 'Users may only cancel their own bookings' }, { status: 403 }, request);
      }
    }

    const { data: updated, error: updateErr } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return jsonWithCors({ error: updateErr.message }, { status: 500 }, request);
    }

    return jsonWithCors(updated, { status: 200 }, request);
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}

// DELETE /api/bookings/:id — cancel a booking
export async function DELETE(
  request: Request,
  { params }: { params: Params }
) {
  const { id } = await params;
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
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !booking) {
      return jsonWithCors({ error: 'Booking not found' }, { status: 404 }, request);
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    const isOwner = booking.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return jsonWithCors({ error: 'Forbidden' }, { status: 403 }, request);
    }

    const { data: cancelled, error: updateErr } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return jsonWithCors({ error: updateErr.message }, { status: 500 }, request);
    }

    return jsonWithCors(cancelled, { status: 200 }, request);
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}
