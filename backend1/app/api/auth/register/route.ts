import { z } from 'zod';
import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

export async function OPTIONS(request: Request) {
  return handleCors(request);
}

const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  full_name: z.string().min(1, 'Full name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.enum(['guest', 'staff', 'admin']).default('guest'),
});

// POST /api/auth/register
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

    const { email, password, full_name, phone, address, role } = result.data;

    // Create auth user via admin API (service role)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: { full_name, role, phone, address },
    });

    if (authError) {
      return jsonWithCors({ error: authError.message }, { status: 400 }, request);
    }

    const userId = authData.user.id;

    // Insert user row with email into the users table
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        full_name,
        phone: phone ?? null,
        address: address ?? null,
        role,
      });

    if (insertError) {
      // Roll back the auth user to keep data consistent
      await supabase.auth.admin.deleteUser(userId);
      return jsonWithCors({ error: insertError.message }, { status: 500 }, request);
    }

    return jsonWithCors(
      { message: 'Registration successful! Please check your email for confirmation.' },
      { status: 201 },
      request
    );
  } catch (err: any) {
    return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
  }
}
