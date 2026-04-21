import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCors(request);
}

// GET /api/schema — returns the columns of the bookings table for diagnostics
export async function GET(request: Request) {
  const supabase = createServerSideClient();

  try {
    const { data, error } = await supabase
      .from('information_schema.columns' as any)
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'bookings')
      .order('ordinal_position' as any);

    if (error) {
      return jsonWithCors({ error: error.message }, { status: 500 }, request);
    }

    return jsonWithCors({ table: 'bookings', columns: data }, { status: 200 }, request);
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}
