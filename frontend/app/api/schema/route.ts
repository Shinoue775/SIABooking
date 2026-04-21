import createServerSideClient from '@/lib/server';
import { NextResponse } from 'next/server';

// GET /api/schema — returns the columns of the bookings table for diagnostics
export async function GET() {
  const supabase = createServerSideClient();

  try {
    const { data, error } = await supabase
      .from('information_schema.columns' as any)
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', 'bookings')
      .order('ordinal_position' as any);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ table: 'bookings', columns: data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
