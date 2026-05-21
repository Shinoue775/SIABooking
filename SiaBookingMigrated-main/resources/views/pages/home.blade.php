@extends('layouts.app')

@section('content')
<!-- Hero Section -->
<div class="relative bg-gray-900 min-h-[500px] h-[70vh] max-h-[600px] overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('{{ asset('images/gcbuildingbg (1).jpg') }}');">
        <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <div class="relative h-full container mx-auto px-4 max-w-7xl flex flex-col items-center justify-center text-center text-white">
        <div class="max-w-3xl px-4">
            <div class="inline-flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <svg class="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-xs sm:text-sm">Welcome to CHTM Room Reservation System</span>
            </div>
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                Experience Comfort & Excellence
            </h1>
            <p class="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 px-2">
                Discover premium accommodations in the heart of the Gordon College campus
            </p>
        </div>

        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            <div class="text-center">
                <div class="flex justify-center mb-1">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">2</div>
                <div class="text-[10px] sm:text-xs text-gray-300">Rooms</div>
            </div>
            <div class="text-center">
                <div class="flex justify-center mb-1">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">0</div>
                <div class="text-[10px] sm:text-xs text-gray-300">Guests</div>
            </div>
            <div class="text-center">
                <div class="flex justify-center mb-1">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div class="text-lg sm:text-xl md:text-2xl font-bold text-white">24/7</div>
                <div class="text-[10px] sm:text-xs text-gray-300">Support</div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Room Card Hover Animations */
    .room-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .room-card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
    
    .room-image-container {
        overflow: hidden;
        position: relative;
    }
    
    .room-image {
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .room-card:hover .room-image {
        transform: scale(1.08);
    }
    
    .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%);
        opacity: 0.6;
        transition: opacity 0.4s ease;
        z-index: 1;
    }
    
    .room-card:hover .image-overlay {
        opacity: 0.8;
    }
    
    .view-details-btn {
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .view-details-btn:hover {
        transform: translateX(4px);
        gap: 12px;
    }
    
    .view-details-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }
    
    .view-details-btn:hover::before {
        width: 300px;
        height: 300px;
    }
    
    .room-badge {
        transition: all 0.3s ease;
    }
    
    .room-card:hover .room-badge {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .room-price {
        transition: all 0.3s ease;
    }
    
    .room-card:hover .room-price {
        color: #15803d;
        transform: scale(1.02);
    }
    
    .nav-btn {
        transition: all 0.3s ease;
        z-index: 2;
    }
    
    .nav-btn:hover {
        background: rgba(0, 0, 0, 0.8);
        transform: scale(1.1);
    }
    
    .dot {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .dot:hover {
        transform: scale(1.3);
        background: white !important;
    }
    
    .room-content {
        transition: all 0.3s ease;
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
    
    .featured-icon {
        animation: pulse 2s ease-in-out infinite;
    }
    
    .room-image-container::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
        z-index: 2;
        pointer-events: none;
    }
    
    .room-card:hover .room-image-container::after {
        left: 100%;
    }
    
    @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(1.05); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    .fade-in {
        animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    
    @keyframes progress {
        0% { width: 0%; }
        100% { width: 100%; }
    }
    
    .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #FFB5C5, #C9A962);
        width: 0%;
        transition: width 0.1s linear;
        z-index: 3;
    }
    
    /* Modal Animation */
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .modal-content {
        animation: slideUp 0.3s ease-out;
    }
</style>

<!-- Main Content - Rooms Section -->
<main class="container mx-auto px-4 max-w-7xl py-8 sm:py-12">
    <!-- Featured Room - Deluxe Room A -->
    <div class="mb-12 sm:mb-16">
        <div class="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <h2 class="text-xl sm:text-2xl font-bold text-gray-800">FEATURED ROOM</h2>
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 featured-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        </div>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden room-card transition-all duration-300" id="roomA-card">
            <div class="flex flex-col md:flex-row">
                <div class="relative h-[300px] sm:h-[350px] md:h-[400px] md:w-1/2 bg-gray-900 room-image-container" id="roomA-slideshow">
                    <div class="absolute inset-0">
                        <img id="roomA-image" src="{{ asset('images/1.jpg') }}" alt="Deluxe Room A" class="object-cover w-full h-full room-image">
                    </div>
                    <div class="absolute inset-0 image-overlay"></div>
                    <div id="roomA-progress" class="progress-bar"></div>
                    <button id="roomA-prev" class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition nav-btn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button id="roomA-next" class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition nav-btn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div id="roomA-dots" class="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10"></div>
                    <div id="roomA-counter" class="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm z-10 backdrop-blur-sm">1 / 5</div>
                </div>

                <div class="p-6 sm:p-8 md:w-1/2 room-content">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 class="text-2xl sm:text-3xl font-bold text-green-800 transition-colors duration-300">Deluxe Room A</h3>
                            <p class="text-lg sm:text-xl font-semibold text-green-700 mt-1 room-price transition-all duration-300">₱4,500</p>
                        </div>
                        <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto room-badge transition-all duration-300">Deluxe</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6 transition-all duration-300 hover:bg-gray-100">
                        <p class="text-gray-600 italic text-xs sm:text-sm">"A luxurious deluxe room featuring two king-sized beds, a relaxing bathtub, mini sala for lounging, and premium amenities for the ultimate comfort experience."</p>
                    </div>
                    <button onclick="openRoomModal('A')" class="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 sm:py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base view-details-btn">
                        View Room Details
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Room B - Standard Room -->
    <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Currently Available Rooms</h2>
        
        <div class="bg-white rounded-xl shadow-lg overflow-hidden room-card transition-all duration-300" id="roomB-card">
            <div class="flex flex-col md:flex-row">
                <div class="relative h-[300px] sm:h-[350px] md:h-[400px] md:w-1/2 md:order-2 bg-gray-900 room-image-container" id="roomB-slideshow">
                    <div class="absolute inset-0">
                        <img id="roomB-image" src="{{ asset('images/6.jpg') }}" alt="Standard Room B" class="object-cover w-full h-full room-image">
                    </div>
                    <div class="absolute inset-0 image-overlay"></div>
                    <div id="roomB-progress" class="progress-bar"></div>
                    <button id="roomB-prev" class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition nav-btn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button id="roomB-next" class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition nav-btn">
                        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div id="roomB-dots" class="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10"></div>
                    <div id="roomB-counter" class="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm z-10 backdrop-blur-sm">1 / 5</div>
                </div>

                <div class="p-6 sm:p-8 md:w-1/2 md:order-1 room-content">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                            <h3 class="text-2xl sm:text-3xl font-bold text-green-800 transition-colors duration-300">Standard Room B</h3>
                            <p class="text-lg sm:text-xl font-semibold text-green-700 mt-1 room-price transition-all duration-300">₱2,500</p>
                        </div>
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto room-badge transition-all duration-300">Standard</span>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6 transition-all duration-300 hover:bg-gray-100">
                        <p class="text-gray-600 italic text-xs sm:text-sm">"A comfortable standard room with two single beds, complete with air conditioning, TV, cabinet storage, and a refreshing shower for a pleasant stay."</p>
                    </div>
                    <button onclick="openRoomModal('B')" class="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 sm:py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base view-details-btn">
                        View Room Details
                        <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>

<!-- Room Modal -->
<div id="roomModal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/70 p-4 backdrop-blur-sm transition-all duration-300">
    <div class="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto modal-content">
        <!-- Close Button -->
        <button onclick="closeRoomModal()" class="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white p-2 rounded-full transition shadow-md hover:scale-110 transform duration-200">
            <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <!-- Modal Image Slideshow -->
        <div class="relative h-64 sm:h-80 md:h-96 w-full bg-gray-900">
            <img id="modal-image" src="" alt="Room" class="object-cover w-full h-full transition-opacity duration-300">
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            <!-- Modal Navigation -->
            <button id="modal-prev" class="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button id="modal-next" class="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
            </button>
            
            <!-- Image Counter -->
            <div id="modal-counter" class="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs">1 / 5</div>
            
            <!-- Title Overlay -->
            <div class="absolute bottom-4 left-6 text-white">
                <h2 id="modal-title" class="text-2xl md:text-3xl font-bold mb-1"></h2>
                <span id="modal-type" class="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium"></span>
            </div>
        </div>

        <!-- Modal Content -->
        <div class="p-6 md:p-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Room Overview</h3>
            <p id="modal-description" class="text-gray-600 text-sm mb-6 leading-relaxed"></p>

            <div class="mb-4">
                <span id="modal-price" class="text-2xl font-bold text-green-700"></span>
                <span class="text-gray-500 text-sm ml-2">per night</span>
            </div>

            <h3 class="text-base font-semibold text-gray-800 mb-3">Amenities Included</h3>
            <div id="modal-amenities" class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6"></div>

            <!-- Modal Actions -->
            <div class="flex flex-row items-center justify-end gap-3 border-t border-gray-100 pt-5">
                <button onclick="closeRoomModal()" class="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition">
                    Close
                </button>
                <a href="/booking" class="bg-green-700 hover:bg-green-800 text-white px-8 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2">
                    Book This Room
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </a>
            </div>
        </div>
    </div>
</div>

<script>
    // Room A Slideshow
    const roomAImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'].map(img => "{{ asset('images/') }}/" + img);
    let roomAIndex = 0;
    let roomAInterval = null;
    let roomAProgressInterval = null;
    let roomAIsHovering = false;
    const SLIDE_DURATION = 5000;

    function updateRoomAImage() {
        const img = document.getElementById('roomA-image');
        if (img) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = roomAImages[roomAIndex];
                img.style.opacity = '1';
            }, 300);
        }
        document.getElementById('roomA-counter').innerHTML = `${roomAIndex + 1} / ${roomAImages.length}`;
        updateDots('roomA', roomAIndex);
        resetProgressBar('roomA');
    }

    function resetProgressBar(room) {
        const progressBar = document.getElementById(`${room}-progress`);
        if (progressBar) {
            progressBar.style.width = '0%';
            if ((room === 'roomA' && !roomAIsHovering) || (room === 'roomB' && !roomBIsHovering)) {
                startProgressBar(room);
            }
        }
    }

    function startProgressBar(room) {
        const progressBar = document.getElementById(`${room}-progress`);
        if (!progressBar) return;
        
        let startTime = Date.now();
        
        const interval = setInterval(() => {
            const isHovering = room === 'roomA' ? roomAIsHovering : roomBIsHovering;
            if (isHovering) return;
            
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 16);
        
        if (room === 'roomA') {
            if (roomAProgressInterval) clearInterval(roomAProgressInterval);
            roomAProgressInterval = interval;
        } else {
            if (roomBProgressInterval) clearInterval(roomBProgressInterval);
            roomBProgressInterval = interval;
        }
    }

    function startRoomASlideshow() {
        if (roomAInterval) clearInterval(roomAInterval);
        roomAInterval = setInterval(() => {
            if (!roomAIsHovering) {
                roomAIndex = (roomAIndex + 1) % roomAImages.length;
                updateRoomAImage();
            }
        }, SLIDE_DURATION);
        startProgressBar('roomA');
    }

    // Room B Slideshow
    const roomBImages = ['6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'].map(img => "{{ asset('images/') }}/" + img);
    let roomBIndex = 0;
    let roomBInterval = null;
    let roomBProgressInterval = null;
    let roomBIsHovering = false;

    function updateRoomBImage() {
        const img = document.getElementById('roomB-image');
        if (img) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = roomBImages[roomBIndex];
                img.style.opacity = '1';
            }, 300);
        }
        document.getElementById('roomB-counter').innerHTML = `${roomBIndex + 1} / ${roomBImages.length}`;
        updateDots('roomB', roomBIndex);
        resetProgressBar('roomB');
    }

    function startRoomBSlideshow() {
        if (roomBInterval) clearInterval(roomBInterval);
        roomBInterval = setInterval(() => {
            if (!roomBIsHovering) {
                roomBIndex = (roomBIndex + 1) % roomBImages.length;
                updateRoomBImage();
            }
        }, SLIDE_DURATION);
        startProgressBar('roomB');
    }

    function updateDots(room, index) {
        const dotsContainer = document.getElementById(`${room}-dots`);
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const images = room === 'roomA' ? roomAImages : roomBImages;
        images.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = `dot transition-all duration-300 ${i === index ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-white rounded-full' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full'}`;
            dot.onclick = (e) => {
                e.stopPropagation();
                if (room === 'roomA') {
                    roomAIndex = i;
                    updateRoomAImage();
                    stopRoomASlideshow();
                    startRoomASlideshow();
                } else {
                    roomBIndex = i;
                    updateRoomBImage();
                    stopRoomBSlideshow();
                    startRoomBSlideshow();
                }
            };
            dotsContainer.appendChild(dot);
        });
    }

    // Hover events
    const roomACard = document.getElementById('roomA-card');
    if (roomACard) {
        roomACard.addEventListener('mouseenter', () => { roomAIsHovering = true; if (roomAProgressInterval) clearInterval(roomAProgressInterval); });
        roomACard.addEventListener('mouseleave', () => { roomAIsHovering = false; startRoomASlideshow(); });
    }

    const roomBCard = document.getElementById('roomB-card');
    if (roomBCard) {
        roomBCard.addEventListener('mouseenter', () => { roomBIsHovering = true; if (roomBProgressInterval) clearInterval(roomBProgressInterval); });
        roomBCard.addEventListener('mouseleave', () => { roomBIsHovering = false; startRoomBSlideshow(); });
    }

    // Navigation buttons
    document.getElementById('roomA-prev')?.addEventListener('click', () => {
        roomAIndex = (roomAIndex - 1 + roomAImages.length) % roomAImages.length;
        updateRoomAImage();
        stopRoomASlideshow();
        startRoomASlideshow();
    });
    document.getElementById('roomA-next')?.addEventListener('click', () => {
        roomAIndex = (roomAIndex + 1) % roomAImages.length;
        updateRoomAImage();
        stopRoomASlideshow();
        startRoomASlideshow();
    });
    document.getElementById('roomB-prev')?.addEventListener('click', () => {
        roomBIndex = (roomBIndex - 1 + roomBImages.length) % roomBImages.length;
        updateRoomBImage();
        stopRoomBSlideshow();
        startRoomBSlideshow();
    });
    document.getElementById('roomB-next')?.addEventListener('click', () => {
        roomBIndex = (roomBIndex + 1) % roomBImages.length;
        updateRoomBImage();
        stopRoomBSlideshow();
        startRoomBSlideshow();
    });

    // Initialize
    updateDots('roomA', 0);
    updateDots('roomB', 0);
    startRoomASlideshow();
    startRoomBSlideshow();

    // Modal functionality
    const roomData = {
        A: {
            title: 'Deluxe Room A',
            type: 'Deluxe',
            price: 4500,
            description: 'A luxurious deluxe room featuring two king-sized beds, a relaxing bathtub, mini sala for lounging, and premium amenities for the ultimate comfort experience.',
            amenities: ['Air Conditioning', 'Smart TV', 'Bathtub', '2 King Beds', 'Mini Sala', 'Cabinet', 'Premium Shower'],
            images: roomAImages
        },
        B: {
            title: 'Standard Room B',
            type: 'Standard',
            price: 2500,
            description: 'A comfortable standard room with two single beds, complete with air conditioning, TV, cabinet storage, and a refreshing shower for a pleasant stay.',
            amenities: ['Air Conditioning', 'TV', '2 Single Beds', 'Cabinet', 'Shower', 'Basic Amenities'],
            images: roomBImages
        }
    };

    let currentRoom = null;
    let modalImageIndex = 0;
    let modalInterval = null;
    let modalIsOpen = false;

    function getAmenityIcon(amenity) {
        if (amenity.includes('Air')) {
            return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>';
        }
        if (amenity.includes('TV')) {
            return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1.5 1.5L9 23l1.5-1.5L12 20l-1.5-3M12 20h8.25M4.5 17h.75M4.5 12h.75M4.5 7h.75M9 17h6.75M15 10.5V6a3 3 0 00-3-3H6a3 3 0 00-3 3v10.5a3 3 0 003 3h6a3 3 0 003-3z" /></svg>';
        }
        if (amenity.includes('Shower') || amenity.includes('Bathtub')) {
            return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
        }
        return '<svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    }

    function updateModalImage() {
        const img = document.getElementById('modal-image');
        if (img && currentRoom) {
            img.style.opacity = '0';
            setTimeout(() => {
                img.src = currentRoom.images[modalImageIndex];
                img.style.opacity = '1';
            }, 300);
        }
        document.getElementById('modal-counter').innerHTML = `${modalImageIndex + 1} / ${currentRoom?.images.length || 1}`;
    }

    function startModalSlideshow() {
        if (modalInterval) clearInterval(modalInterval);
        modalInterval = setInterval(() => {
            if (modalIsOpen && currentRoom) {
                modalImageIndex = (modalImageIndex + 1) % currentRoom.images.length;
                updateModalImage();
            }
        }, 4000);
    }

    function stopModalSlideshow() {
        if (modalInterval) {
            clearInterval(modalInterval);
            modalInterval = null;
        }
    }

    function openRoomModal(roomKey) {
        currentRoom = roomData[roomKey];
        modalImageIndex = 0;
        modalIsOpen = true;
        
        document.getElementById('modal-title').innerText = currentRoom.title;
        document.getElementById('modal-type').innerText = `${currentRoom.type} Room`;
        document.getElementById('modal-description').innerText = currentRoom.description;
        document.getElementById('modal-price').innerHTML = `₱${currentRoom.price.toLocaleString()}`;
        
        const amenitiesContainer = document.getElementById('modal-amenities');
        amenitiesContainer.innerHTML = '';
        currentRoom.amenities.forEach(amenity => {
            const div = document.createElement('div');
            div.className = 'flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100';
            div.innerHTML = `${getAmenityIcon(amenity)}<span class="text-xs sm:text-sm font-medium">${amenity}</span>`;
            amenitiesContainer.appendChild(div);
        });
        
        // Set initial image
        const modalImg = document.getElementById('modal-image');
        if (modalImg) {
            modalImg.src = currentRoom.images[0];
            modalImg.style.opacity = '1';
        }
        
        startModalSlideshow();
        const modal = document.getElementById('roomModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    function closeRoomModal() {
        modalIsOpen = false;
        stopModalSlideshow();
        const modal = document.getElementById('roomModal');
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        currentRoom = null;
    }

    // Modal navigation
    document.getElementById('modal-prev')?.addEventListener('click', () => {
        if (currentRoom) {
            modalImageIndex = (modalImageIndex - 1 + currentRoom.images.length) % currentRoom.images.length;
            updateModalImage();
            stopModalSlideshow();
            startModalSlideshow();
        }
    });
    
    document.getElementById('modal-next')?.addEventListener('click', () => {
        if (currentRoom) {
            modalImageIndex = (modalImageIndex + 1) % currentRoom.images.length;
            updateModalImage();
            stopModalSlideshow();
            startModalSlideshow();
        }
    });
</script>
@endsection