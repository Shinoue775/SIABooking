import createServerSideClient from '@/lib/server';
import { handleCors, jsonWithCors } from '@/lib/cors';

export async function OPTIONS(request: Request) {   
    return handleCors(request);
}

// /api/auth/user 
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
        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            return jsonWithCors({
                id: user.id,
                email: user.email,
                full_name: user.user_metadata?.full_name || '',
                role: 'user',
            }, { status: 200 }, request);
        }

        return jsonWithCors({
            ...profile,
            email: user.email,
        }, { status: 200 }, request);
    } catch (err: any) {
        return jsonWithCors({ error: err.message || 'Unknown error' }, { status: 500 }, request);
    }
}
