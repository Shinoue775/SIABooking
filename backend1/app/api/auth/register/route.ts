import { z } from 'zod';
import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCors(request);
}

const registerSchema = z.object({
  id: z.string().uuid('Valid user id is required'),
  email: z.string().email('Valid email is required'),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['guest', 'staff', 'admin']).default('guest'),
});

// POST /api/auth/register
// Called after supabase.auth.signUp() on the frontend to persist the user
// profile (including email) into the public users table.
export async function POST(request: Request) {
  const supabase = createServerSideClient();

  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return jsonWithCors(
        { error: 'Invalid payload', details: result.error.format() },
        { status: 400 },
        request
      );
    }

    const { id, email, full_name, phone, address, role } = result.data;

    // Insert (or update) the user row with email in the users table.
    // Uses the service-role client so it bypasses RLS.
    const { error: insertError } = await supabase
      .from('users')
      .upsert({
        id,
        email,
        full_name,
        phone: phone ?? null,
        address: address ?? null,
        role,
      });

    if (insertError) {
      return jsonWithCors({ error: insertError.message }, { status: 500 }, request);
    }

    return jsonWithCors(
      { message: 'User profile saved successfully.' },
      { status: 201 },
      request
    );
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}
