<nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-3 sm:py-4">
            <!-- Logo Section -->
            <a href="/" class="flex items-center shrink-0 group">
                <img 
                    src="{{ asset('images/logos1.png') }}" 
                    alt="CHTM-RRS Logo"
                    class="object-contain h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                >
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center gap-6 lg:gap-8">
                <a href="/" class="relative py-2 transition-colors duration-200 hover:text-[#FFB5C5]" style="color: rgba(61, 90, 76, 0.7); font-size: 14px;">
                    Home
                </a>
                <a href="/booking" class="relative py-2 transition-colors duration-200" style="color: #3D5A4C; font-size: 14px; font-weight: 500;">
                    Booking
                    <span class="absolute left-0 bottom-0 w-full" style="height: 2px; background: linear-gradient(90deg, #FFB5C5, #C9A962); border-radius: 2px;"></span>
                </a>
                
                <!-- User Menu (shown when logged in) -->
                <div id="userMenuDesktop" class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            <span id="userInitial">U</span>
                        </div>
                        <div>
                            <div class="text-sm font-semibold" style="color: #3D5A4C;" id="userName">User</div>
                            <div class="text-xs" style="color: rgba(61, 90, 76, 0.6);" id="userEmail">user@example.com</div>
                        </div>
                    </div>
                    <button id="logoutBtn" class="px-4 py-2 rounded-lg text-white transition-colors duration-200" style="background: #FF0080; font-size: 12px;" onclick="logout()">
                        Logout
                    </button>
                </div>
                
                <!-- Login Link (shown when not logged in) -->
                <a href="/login" id="loginLink" class="py-2 transition-colors duration-200 hover:text-[#FFB5C5]" style="color: rgba(61, 90, 76, 0.7); font-size: 14px;">
                    Login
                </a>
            </div>

            <!-- Hamburger Menu Button - Mobile -->
            <button id="mobile-menu-button" class="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none hover:bg-gray-50 transition-colors duration-200" aria-label="Toggle menu">
                <div class="relative w-6 h-5">
                    <span class="absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out top-0"></span>
                    <span class="absolute left-0 w-full h-0.5 bg-[#3D5A4C] top-2 transition-opacity duration-300 ease-in-out opacity-100"></span>
                    <span class="absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out top-4"></span>
                </div>
            </button>
        </div>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div id="mobile-menu" class="md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out max-h-0 opacity-0">
        <div class="flex flex-col px-4 py-3 space-y-2">
            <a href="/" class="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200" style="color: rgba(61, 90, 76, 0.7); font-size: 16px;">
                Home
            </a>
            <a href="/booking" class="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200" style="color: #3D5A4C; font-size: 16px; font-weight: 500;">
                Booking
            </a>
            
            <!-- Mobile User Menu (shown when logged in) -->
            <div id="userMenuMobile" class="border-t border-gray-100 pt-3 mt-3 space-y-2">
                <div class="flex items-center gap-2 py-2 px-2">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        <span id="userInitialMobile">U</span>
                    </div>
                    <div>
                        <div class="text-sm font-semibold" style="color: #3D5A4C;" id="userNameMobile">User</div>
                        <div class="text-xs" style="color: rgba(61, 90, 76, 0.6);" id="userEmailMobile">user@example.com</div>
                    </div>
                </div>
                <button id="logoutBtnMobile" class="w-full py-2 px-2 rounded-md text-white text-sm transition-colors duration-200" style="background: #FF0080;" onclick="logout()">
                    Logout
                </button>
            </div>
            
            <!-- Mobile Login Link (shown when not logged in) -->
            <a href="/login" id="loginLinkMobile" class="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200" style="color: rgba(61, 90, 76, 0.7); font-size: 16px;">
                Login
            </a>
        </div>
    </div>
</nav>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
<script>
    const supabaseUrl = {!! json_encode(env('SUPABASE_URL') ?? '') !!};
    const supabaseAnonKey = {!! json_encode(env('SUPABASE_ANON_KEY') ?? '') !!};
    window.supabaseClient = null;
    
    if (typeof supabase !== 'undefined' && supabaseUrl) {
        try {
            window.supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);
        } catch (e) {
            console.warn('Supabase client init failed', e);
        }
    }
    var supabaseClient = window.supabaseClient;

    // Function to update navbar based on auth state
    function updateAuthUI(user) {
        const userMenuDesktop = document.getElementById('userMenuDesktop');
        const loginLink = document.getElementById('loginLink');
        const userMenuMobile = document.getElementById('userMenuMobile');
        const loginLinkMobile = document.getElementById('loginLinkMobile');

        if (user) {
            // User is logged in
            if (userMenuDesktop) userMenuDesktop.style.display = 'flex';
            if (loginLink) loginLink.style.display = 'none';
            if (userMenuMobile) userMenuMobile.style.display = 'block';
            if (loginLinkMobile) loginLinkMobile.style.display = 'none';

            // Get user email and name
            const email = user.email || 'User';
            const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
            const initial = name.charAt(0).toUpperCase();

            // Update desktop user display
            document.getElementById('userName').textContent = name;
            document.getElementById('userEmail').textContent = email;
            document.getElementById('userInitial').textContent = initial;

            // Update mobile user display
            document.getElementById('userNameMobile').textContent = name;
            document.getElementById('userEmailMobile').textContent = email;
            document.getElementById('userInitialMobile').textContent = initial;

            console.log('User logged in:', user);
        } else {
            // User is not logged in
            if (userMenuDesktop) userMenuDesktop.style.display = 'none';
            if (loginLink) loginLink.style.display = 'block';
            if (userMenuMobile) userMenuMobile.style.display = 'none';
            if (loginLinkMobile) loginLinkMobile.style.display = 'block';

            console.log('No user logged in');
        }
    }

    // Function to logout
    async function logout() {
        if (!supabaseClient) {
            alert('Logout service not available');
            return;
        }

        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                alert('Logout failed: ' + error.message);
            } else {
                console.log('User logged out successfully');
                window.location.href = '/login';
            }
        } catch (err) {
            console.error('Logout failed', err);
            alert('Logout failed. Check console for details.');
        }
    }

    const BOOKING_API_BASE_URL = @json(config('services.booking_api.base_url'));
    async function ensureUserProfile(session) {
        if (!session?.user || !session?.access_token) return;
        const user = session.user;
        const meta = user.user_metadata || {};
        const googleFullName = meta.full_name || meta.name || '';
        const parts = googleFullName.trim().split(/\s+/);
        const fname = meta.given_name || parts[0] || user.email.split('@')[0];
        const lname = meta.family_name || (parts.length > 1 ? parts.slice(1).join(' ') : '');

        try {
            await fetch(`${BOOKING_API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    id: user.id,
                    email: user.email,
                    full_name: googleFullName || user.email,
                    fname: fname,
                    lname: lname || 'User',
                }),
            });
        } catch (e) {
            console.warn('ensureUserProfile failed:', e);
        }
    }

    // Check auth state on page load
    document.addEventListener('DOMContentLoaded', async function() {
        if (!supabaseClient) return;

        try {
            // Get current session
            const { data: { session } } = await supabaseClient.auth.getSession();
            if (session?.user) {
                updateAuthUI(session.user);
                ensureUserProfile(session);
            } else {
                updateAuthUI(null);
            }

            // Listen for auth state changes
            supabaseClient.auth.onAuthStateChange((event, session) => {
                console.log('Auth event:', event);
                if (session?.user) {
                    updateAuthUI(session.user);
                    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                        ensureUserProfile(session);
                    }
                } else {
                    updateAuthUI(null);
                }
            });
        } catch (err) {
            console.warn('Auth check failed', err);
            updateAuthUI(null);
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        const mobileMenuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        let isOpen = false;

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                isOpen = !isOpen;
                const spans = this.querySelectorAll('span');
                
                if (isOpen) {
                    mobileMenu.classList.remove('max-h-0', 'opacity-0');
                    mobileMenu.classList.add('max-h-64', 'opacity-100');
                    spans[0].classList.add('rotate-45', 'top-2');
                    spans[1].classList.add('opacity-0');
                    spans[2].classList.add('-rotate-45', 'top-2');
                } else {
                    mobileMenu.classList.remove('max-h-64', 'opacity-100');
                    mobileMenu.classList.add('max-h-0', 'opacity-0');
                    spans[0].classList.remove('rotate-45', 'top-2');
                    spans[1].classList.remove('opacity-0');
                    spans[2].classList.remove('-rotate-45', 'top-2');
                }
            });
        }
    });
</script>