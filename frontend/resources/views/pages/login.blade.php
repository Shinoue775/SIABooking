<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - CHTM Room Reservation System</title>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;600&family=Inter:wght@300;400;500;600;700&family=Montserrat:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .font-cormorant { font-family: 'Cormorant', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
    </style>
</head>
<body>
    <div class="flex flex-col lg:flex-row min-h-screen">
        <!-- Left Side - Branding -->
        <div class="relative lg:w-1/2 min-h-[400px] lg:min-h-screen">
            <div class="absolute inset-0">
                <img src="{{ asset('images/loginchtmbg (1).jpg') }}" alt="Background" class="object-cover w-full h-full">
                <div class="absolute inset-0 bg-black/50 lg:bg-black/40"></div>
            </div>
            <div class="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 text-white">
                <div class="flex items-center gap-4 mb-8">
                    <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
                        <img src="{{ asset('images/chtmlogo.png') }}" alt="CHTM Logo" class="object-contain w-full h-full">
                    </div>
                    <div class="text-center">
                        <h1 class="text-3xl md:text-4xl font-bold tracking-wide" style="font-family: Montserrat, serif; color: #FF0080;">CHTM-RRS</h1>
                        <p class="text-sm md:text-base mt-1 font-medium tracking-wide">ROOM RESERVATION SYSTEM</p>
                    </div>
                    <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
                        <img src="{{ asset('images/gc (1).png') }}" alt="GC Logo" class="object-contain mix-blend-multiply w-full h-full">
                    </div>
                </div>
                <div class="w-full max-w-[550px]">
                    <p class="text-center text-base md:text-lg italic font-light leading-relaxed">"Enhancing service excellence through the College of Hospitality and Tourism Management"</p>
                    <div class="w-full h-1 bg-pink-600 mt-6"></div>
                    <p class="mt-6 text-center text-xl md:text-2xl font-bold tracking-wide">CHTM Department</p>
                </div>
            </div>
        </div>

        <!-- Right Side - Login Form -->
        <div class="flex-1 flex items-center justify-center p-4 bg-white">
            <div class="w-full max-w-md px-4 py-8">
                <div class="mb-8 text-center lg:text-left">
                    <h2 class="font-cormorant font-light mb-3" style="color: #3D5A4C; font-size: clamp(32px, 8vw, 56px);">Welcome</h2>
                    <div class="w-40 h-1 bg-pink-600 mb-3 mx-auto lg:mx-0"></div>
                    <p class="text-gray-600 text-base font-medium">Please sign in to continue.</p>
                </div>

                <div class="space-y-4">
                    <button id="googleSignInBtn" class="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 px-4 rounded-md transition font-medium bg-white hover:bg-gray-50 shadow-sm">
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5">
                        <span class="text-sm">Sign in only</span>
                    </button>
                </div>

                <div class="mt-6">
                    <label class="flex items-start gap-3 cursor-pointer">
                        <div class="relative flex items-center">
                            <input type="checkbox" class="sr-only peer">
                            <div class="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-pink-600 peer-checked:bg-pink-600 transition"></div>
                            <svg class="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span class="text-sm text-gray-700">I agree to the <button type="button" id="showTermsBtn" class="text-pink-600 font-semibold underline">Terms and Conditions</button></span>
                    </label>
                </div>

                <div class="mt-8 text-center">
                    <p class="text-gray-400 text-xs">© 2026 CHTMRRS. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Terms Modal -->
    <div id="termsModal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
            <div class="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 class="text-2xl font-cormorant" style="color: #3D5A4C;">Terms & Conditions</h3>
                <button id="closeTermsBtn" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100">
                    <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-6">
                <div class="space-y-6 text-gray-700">
                    <div class="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-600">
                        <p class="text-sm">Please read these terms carefully before using the CHTM Room Reservation System.</p>
                    </div>
                    <section><h4 class="text-lg font-semibold">1. Acceptance of Terms</h4><p class="text-sm">By accessing and using the CHTM Room Reservation System, you agree to these Terms and Conditions.</p></section>
                    <section><h4 class="text-lg font-semibold">2. Eligibility</h4><p class="text-sm">This system is exclusively for Gordon College faculty, staff, and authorized personnel.</p></section>
                    <section><h4 class="text-lg font-semibold">3. Room Rates & Amenities</h4><p class="text-sm">Rates include all listed amenities. Extra mattress charge: ₱700. Maximum of 4 persons per room. PWD discount: 20%.</p></section>
                    <section><h4 class="text-lg font-semibold">4. Guest & Occupancy Policy</h4><p class="text-sm">Children 2 and below stay free. Children 3+ count as additional guests.</p></section>
                    <section><h4 class="text-lg font-semibold">5. Check-in & Check-out</h4><p class="text-sm">Check-in: 3:00 PM, Check-out: 11:00 AM. Late check-in accepted until 9:00 PM.</p></section>
                </div>
            </div>
            <div class="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3">
                <button id="agreeTermsBtn" class="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition">I Agree</button>
                <button id="closeTermsBtn2" class="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg border border-gray-300">Close</button>
            </div>
        </div>
    </div>

    <script>
        const termsModal = document.getElementById('termsModal');
        const showTermsBtns = document.querySelectorAll('#showTermsBtn');
        const closeTermsBtns = document.querySelectorAll('#closeTermsBtn, #closeTermsBtn2');
        const agreeTermsBtn = document.getElementById('agreeTermsBtn');
        const checkbox = document.querySelector('input[type="checkbox"]');
        
        function openModal() { termsModal.classList.remove('hidden'); termsModal.classList.add('flex'); }
        function closeModal() { termsModal.classList.remove('flex'); termsModal.classList.add('hidden'); }
        
        showTermsBtns.forEach(btn => btn.addEventListener('click', openModal));
        closeTermsBtns.forEach(btn => btn.addEventListener('click', closeModal));
        
        agreeTermsBtn.addEventListener('click', () => {
            if (checkbox) checkbox.checked = true;
            closeModal();
        });
        
        termsModal.addEventListener('click', (e) => { if (e.target === termsModal) closeModal(); });
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
    <script>
        const googleSignInBtn = document.getElementById('googleSignInBtn');
        const checkboxInput = document.querySelector('input[type="checkbox"]');
        const supabaseUrl = {!! json_encode(env('SUPABASE_URL') ?? '') !!};
        const supabaseAnonKey = {!! json_encode(env('SUPABASE_ANON_KEY') ?? '') !!};
        let supabaseClient = null;
        if (typeof supabase !== 'undefined' && supabaseUrl) {
            try {
                supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
            } catch (e) {
                console.warn('Supabase client init failed', e);
                supabaseClient = null;
            }
        }

        // Check for existing session on page load
        async function checkExistingSession() {
            if (!supabaseClient) return;
            try {
                const { data: { session } } = await supabaseClient.auth.getSession();
                if (session) {
                    console.log('Existing session found, redirecting to /home');
                    window.location.href = '/home';
                }
            } catch (e) {
                console.warn('Session check failed', e);
            }
        }

        // Check session on page load
        checkExistingSession();

        // Listen for auth state changes
        if (supabaseClient) {
            supabaseClient.auth.onAuthStateChange((event, session) => {
                console.log('Auth state changed:', event, session);
                if (session) {
                    console.log('User logged in, redirecting to /home');
                    window.location.href = '/home';
                }
            });
        }

        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', async () => {
                // Debug: print values so we can confirm env injection
                try {
                    console.log('DEBUG supabaseUrl ->', supabaseUrl);
                    console.log('DEBUG supabaseAnonKey ->', supabaseAnonKey ? (String(supabaseAnonKey).slice(0, 20) + '...') : supabaseAnonKey);
                } catch (e) {
                    console.warn('DEBUG: unable to read supabase globals', e);
                }

                if (!checkboxInput || !checkboxInput.checked) {
                    alert('Please agree to the Terms and Conditions before signing in.');
                    return;
                }

                if (!supabaseClient) {
                    alert('Google sign-in is not configured or unavailable. Please set SUPABASE_URL and SUPABASE_ANON_KEY in frontend/.env and ensure the Supabase script loaded.');
                    return;
                }

                if (!supabaseUrl || supabaseUrl.includes('your-project-ref') || !supabaseAnonKey || supabaseAnonKey.includes('your-anon-key')) {
                    alert('Google sign-in is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in frontend/.env.');
                    return;
                }

                try {
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                            redirectTo: window.location.origin + '/home',
                        },
                    });

                    if (error) {
                        console.error('Supabase OAuth error:', error);
                        alert(`Google sign-in failed: ${error.message}`);
                    }
                } catch (err) {
                    console.error('OAuth initiation failed', err);
                    alert('Google sign-in failed to start. Check console for details.');
                }
            });
        }
    </script>
</body>
</html>
