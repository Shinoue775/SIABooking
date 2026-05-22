<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'CHTM-RRS - Room Reservation System')</title>
    <meta name="description" content="@yield('description', 'Gordon College CHTM Room Reservation System - Book your stay with us')">
    
    {{-- Google Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@300;400;500;600;700&family=Inter:wght@100..900&family=Montserrat:wght@700&display=swap" rel="stylesheet">
    
    {{-- Tailwind CSS CDN (for quick styling) --}}
    <script src="https://cdn.tailwindcss.com"></script>
    
   
    
    {{-- Alpine.js for interactivity --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <style>
        :root {
            --font-geist-sans: 'Inter', sans-serif;
            --font-geist-mono: 'Courier New', monospace;
        }
        
        /* Smooth scrolling for anchor links */
        html {
            scroll-behavior: smooth;
        }
        
        /* Custom Font Classes */
        .font-cormorant { font-family: 'Cormorant', serif; }
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
        
        /* Custom Animations */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateY(-20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        
        /* Transition Utilities */
        .transition-smooth { transition: all 0.3s ease-in-out; }
        .hover-lift:hover { transform: translateY(-2px); }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
            background: #3D5A4C;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #2d4a3c;
        }
        
        /* Mobile Menu Transitions */
        .max-h-0 { max-height: 0; }
        .max-h-64 { max-height: 16rem; }
        .max-h-96 { max-height: 24rem; }
        .rotate-45 { transform: rotate(45deg); }
        .-rotate-45 { transform: rotate(-45deg); }
        .top-2 { top: 0.5rem; }
        .opacity-0 { opacity: 0; }
        .opacity-100 { opacity: 1; }
        
        /* Loading Spinner */
        .spinner {
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 2px solid #ffffff;
            width: 20px;
            height: 20px;
            animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Responsive Text Utilities */
        .text-clamp-sm { font-size: clamp(10px, 3vw, 12px); }
        .text-clamp-base { font-size: clamp(13px, 3.5vw, 14px); }
        .text-clamp-lg { font-size: clamp(14px, 4vw, 16px); }
        .text-clamp-xl { font-size: clamp(18px, 5vw, 24px); }
        .text-clamp-2xl { font-size: clamp(24px, 6vw, 36px); }
        .text-clamp-3xl { font-size: clamp(28px, 7vw, 48px); }
        .text-clamp-4xl { font-size: clamp(32px, 8vw, 56px); }
    </style>
    
    @stack('styles')
</head>

<body class="antialiased min-h-screen flex flex-col font-inter text-gray-900 bg-white">
    {{-- Navbar Component --}}
    @include('layouts.navbar')
    
    {{-- Main Content --}}
    <main class="flex-grow">
        @yield('content')
    </main>
    
    {{-- Footer Component --}}
    @include('layouts.footer')
    
    {{-- Mobile Menu JavaScript --}}
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuBtn && mobileMenu) {
                let isOpen = false;
                const spans = mobileMenuBtn.querySelectorAll('span');
                
                mobileMenuBtn.addEventListener('click', function() {
                    isOpen = !isOpen;
                    
                    if (isOpen) {
                        mobileMenu.classList.remove('max-h-0', 'opacity-0');
                        mobileMenu.classList.add('max-h-64', 'opacity-100');
                        if (spans[0]) {
                            spans[0].classList.add('rotate-45', 'top-2');
                            spans[0].classList.remove('top-0');
                        }
                        if (spans[1]) spans[1].classList.add('opacity-0');
                        if (spans[2]) {
                            spans[2].classList.add('-rotate-45', 'top-2');
                            spans[2].classList.remove('top-4');
                        }
                    } else {
                        mobileMenu.classList.remove('max-h-64', 'opacity-100');
                        mobileMenu.classList.add('max-h-0', 'opacity-0');
                        if (spans[0]) {
                            spans[0].classList.remove('rotate-45', 'top-2');
                            spans[0].classList.add('top-0');
                        }
                        if (spans[1]) spans[1].classList.remove('opacity-0');
                        if (spans[2]) {
                            spans[2].classList.remove('-rotate-45', 'top-2');
                            spans[2].classList.add('top-4');
                        }
                    }
                });
            }
            
            // Close mobile menu when clicking on a link
            const mobileLinks = document.querySelectorAll('#mobile-menu a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (mobileMenu && mobileMenuBtn) {
                        mobileMenu.classList.remove('max-h-64', 'opacity-100');
                        mobileMenu.classList.add('max-h-0', 'opacity-0');
                        const spans = mobileMenuBtn.querySelectorAll('span');
                        if (spans[0]) {
                            spans[0].classList.remove('rotate-45', 'top-2');
                            spans[0].classList.add('top-0');
                        }
                        if (spans[1]) spans[1].classList.remove('opacity-0');
                        if (spans[2]) {
                            spans[2].classList.remove('-rotate-45', 'top-2');
                            spans[2].classList.add('top-4');
                        }
                    }
                });
            });
        });
    </script>
    
    @stack('scripts')
</body>
</html>