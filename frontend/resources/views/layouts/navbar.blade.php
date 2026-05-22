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
                <a href="/login" class="py-2 transition-colors duration-200 hover:text-[#FFB5C5]" style="color: rgba(61, 90, 76, 0.7); font-size: 14px;">
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
            <a href="/login" class="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200" style="color: rgba(61, 90, 76, 0.7); font-size: 16px;">
                Login
            </a>
        </div>
    </div>
</nav>

<script>
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