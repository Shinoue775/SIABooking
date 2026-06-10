<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Signing in - CHTM Room Reservation System</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-white flex items-center justify-center p-6">
    <div class="w-full max-w-md text-center">
        <div class="mx-auto mb-6 h-12 w-12 rounded-full border-4 border-pink-100 border-t-pink-600 animate-spin"></div>
        <h1 class="text-2xl font-semibold text-[#3D5A4C]">Signing you in</h1>
        <p id="authStatus" class="mt-3 text-sm text-gray-600">Please wait while we finish your Google sign-in.</p>
        <a id="retryLink" href="/login" class="hidden mt-6 inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700">Back to login</a>
    </div>

    <script type="module">
        import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

        const supabaseUrl = @json(config('services.supabase.url'));
        const supabaseAnonKey = @json(config('services.supabase.anon_key'));
        const redirectAfterLogin = new URL('/booking', window.location.origin).href;
        const statusEl = document.getElementById('authStatus');
        const retryLink = document.getElementById('retryLink');

        function showError(message) {
            statusEl.textContent = message;
            statusEl.className = 'mt-3 text-sm text-red-700';
            retryLink.classList.remove('hidden');
        }

        if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-ref') || supabaseAnonKey === 'your-anon-key') {
            showError('Google sign-in is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY to frontend/.env.');
        } else {
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            try {
                const params = new URLSearchParams(window.location.search);
                if (params.has('error') || params.has('error_description')) {
                    throw new Error(params.get('error_description') || params.get('error') || 'Google sign-in was cancelled.');
                }

                if (params.has('code')) {
                    const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
                    if (error) throw error;
                }

                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;
                if (!data.session) throw new Error('No sign-in session was returned.');

                localStorage.setItem('sb_access_token', data.session.access_token);
                localStorage.setItem('sb_user', JSON.stringify(data.session.user));

                const bookingApiBase = @json(config('services.booking_api.base_url'));
                const user = data.session.user;
                const profilePayload = {
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
                };

                const registerResponse = await fetch(`${bookingApiBase}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${data.session.access_token}`,
                    },
                    body: JSON.stringify(profilePayload),
                });

                if (!registerResponse.ok) {
                    const err = await registerResponse.json().catch(() => null);
                    throw new Error(`Sign-in succeeded, but saving your account failed: ${err?.error || registerResponse.statusText || 'Unknown backend error'}`);
                }

                window.location.replace(redirectAfterLogin);
            } catch (error) {
                showError(error.message || 'Unable to finish sign-in. Please try again.');
            }
        }
    </script>
</body>
</html>
