import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Cached mapping of logical column names to actual DB column names.
 * Populated on first use by querying information_schema.columns.
 */
let columnCache: Record<string, string> | null = null;

/**
 * Alternative names to probe when the code's canonical name does not exist.
 * Keys are the names used in this codebase; values are ordered fallback lists.
 */
const COLUMN_ALTERNATIVES: Record<string, string[]> = {
  // The checkout / booking-end timestamp column
  end_at: ['end_at', 'end_date', 'checkout_at', 'check_out_at', 'check_out', 'end_time', 'ends_at'],
  // The check-in / booking-start timestamp column
  start_at: ['start_at', 'start_date', 'checkin_at', 'check_in_at', 'check_in', 'start_time', 'starts_at'],
};

/**
 * Fetches all column names for the `bookings` table from information_schema
 * and builds the column mapping.  The result is cached for the lifetime of
 * the serverless function instance.
 */
export async function resolveBookingColumns(
  supabase: SupabaseClient
): Promise<Record<string, string>> {
  if (columnCache) return columnCache;

  try {
    const { data, error } = await supabase
      .from('information_schema.columns' as any)
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'archived_bookings');

    if (error || !data) {
      console.error('[schema] Could not fetch bookings columns:', error?.message);
      columnCache = {};
      return columnCache;
    }

    const existingColumns = new Set<string>(
      (data as Array<{ column_name: string }>).map((r) => r.column_name)
    );

    const resolved: Record<string, string> = {};
    for (const [canonical, alternatives] of Object.entries(COLUMN_ALTERNATIVES)) {
      const match = alternatives.find((alt) => existingColumns.has(alt));
      if (match) resolved[canonical] = match;
    }

    columnCache = resolved;
    return resolved;
  } catch (err) {
    console.error('[schema] Failed to resolve booking columns:', err);
    columnCache = {};
    return {};
  }
}

/**
 * Returns the actual DB column name for `canonical`, falling back to
 * `canonical` itself when no override is known.
 */
export function col(map: Record<string, string>, canonical: string): string {
  return map[canonical] ?? canonical;
}

/** Clears the column-name cache (useful in tests). */
export function clearColumnCache(): void {
  columnCache = null;
}
