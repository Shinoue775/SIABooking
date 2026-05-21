@extends('layouts.app')

@section('content')
<!-- Hero Section -->
<section class="relative flex items-center justify-center lg:justify-start" style="min-height: calc(100vh - 64px); background: #FFFAF5;">
    <!-- Background Image -->
    <div class="absolute inset-0 lg:left-auto lg:right-0 lg:w-[52%] h-full z-0">
        <img src="{{ asset('images/gcbuildingbg (1).jpg') }}" alt="Building" class="object-cover w-full h-full">
        <div class="absolute inset-0 bg-black/50 lg:bg-black/40"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
        <div class="bg-white/95 backdrop-blur-sm shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 mx-auto lg:mx-0 lg:ml-[8%] w-full" style="max-width: min(90%, 580px); border-left: 4px solid #FF0080;">
            <p style="color: #C9A962; font-size: clamp(10px, 3vw, 12px); font-weight: 700;">
                Est. 2026
            </p>

            <h1 class="font-cormorant" style="margin-top: clamp(16px, 4vw, 24px); font-size: clamp(32px, 8vw, 61px); font-weight: 400; line-height: 1.2; color: #3D5A4C;">
                ROOM RESERVATION
            </h1>
            
            <p style="margin-top: clamp(12px, 3vw, 16px); font-size: clamp(14px, 3.5vw, 20px); font-weight: 400; line-height: 1.5; color: rgba(61, 90, 76, 0.8);">
                Discover real-time availability, personalized options, and a seamless reservation experience designed to make every trip effortless.
            </p>

            <div class="flex flex-col sm:flex-row gap-3 sm:gap-4" style="margin-top: clamp(24px, 6vw, 32px);">
                <a href="/booking" class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-center transition hover:bg-[#2d4338] w-full sm:w-auto" style="background: #3D5A4C; color: #FFFAF5; font-size: clamp(13px, 3.5vw, 14px); font-weight: 500;">
                    Book Your Stay
                </a>
                <a href="/booking" class="px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-center transition hover:bg-gray-50 border w-full sm:w-auto" style="border-color: #3D5A4C; background: white; color: #3D5A4C; font-size: clamp(13px, 3.5vw, 14px); font-weight: 500;">
                    Check Availability
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Features Section -->
<section class="py-12 sm:py-16 md:py-24" style="background: #FFFAF5;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
            <!-- Feature 1 -->
            <div class="text-center sm:text-left px-4 sm:px-0">
                <div class="mb-4 flex justify-center sm:justify-start">
                    <svg class="w-10 h-10 md:w-12 md:h-12" style="color: #3D5A4C;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h3 style="font-size: clamp(18px, 4vw, 20px); color: #3D5A4C; font-weight: 400;">
                    Artisan Dining
                </h3>
                <p style="margin-top: 12px; font-size: clamp(13px, 3.5vw, 14px); line-height: 1.6; color: rgba(61, 90, 76, 0.7);">
                    Locally sourced ingredients prepared with French techniques.
                </p>
            </div>

            <!-- Feature 2 -->
            <div class="text-center sm:text-left px-4 sm:px-0">
                <div class="mb-4 flex justify-center sm:justify-start">
                    <svg class="w-10 h-10 md:w-12 md:h-12" style="color: #3D5A4C;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                </div>
                <h3 style="font-size: clamp(18px, 4vw, 20px); color: #3D5A4C; font-weight: 400;">
                    Modern Comfort
                </h3>
                <p style="margin-top: 12px; font-size: clamp(13px, 3.5vw, 14px); line-height: 1.6; color: rgba(61, 90, 76, 0.7);">
                    High-speed connectivity in a space designed for tranquility.
                </p>
            </div>

            <!-- Feature 3 -->
            <div class="text-center sm:text-left px-4 sm:px-0">
                <div class="mb-4 flex justify-center sm:justify-start">
                    <svg class="w-10 h-10 md:w-12 md:h-12" style="color: #3D5A4C;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h3 style="font-size: clamp(18px, 4vw, 20px); color: #3D5A4C; font-weight: 400;">
                    Prime Location
                </h3>
                <p style="margin-top: 12px; font-size: clamp(13px, 3.5vw, 14px); line-height: 1.6; color: rgba(61, 90, 76, 0.7);">
                    Steps away from the city's finest cultural institutions.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Experience Section -->
<section class="py-12 sm:py-16 md:py-24 lg:py-32" style="background: #3D5A4C;">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-8 md:gap-10 lg:gap-16 items-center">
            <div class="w-full lg:w-1/2 order-2 lg:order-1">
                <div class="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-sm overflow-hidden shadow-2xl">
                    <img src="{{ asset('images/loginchtmbg (1).jpg') }}" alt="Experience" class="object-cover w-full h-full">
                </div>
            </div>

            <div class="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
                <p style="font-size: clamp(11px, 3vw, 12px); color: #FFB5C5; letter-spacing: 1px;">
                    THE EXPERIENCE
                </p>
                
                <h2 class="font-cormorant" style="margin-top: clamp(12px, 3vw, 16px); font-size: clamp(28px, 6vw, 52px); font-weight: 400; line-height: 1.2; color: #FFFAF5;">
                    Designed for the<br>
                    <span style="color: #FFB5C5;">Discerning Traveler</span>
                </h2>

                <p style="margin-top: clamp(16px, 4vw, 24px); font-size: clamp(14px, 3vw, 18px); font-weight: 300; line-height: 1.6; color: rgba(255, 250, 245, 0.8);">
                    Experience the perfect harmony of sophisticated design and genuine hospitality. Tailored for those who appreciate the finer details, our accommodations offer a tranquil escape equipped with premium amenities.
                </p>

                <div class="flex flex-row justify-center lg:justify-start gap-8 sm:gap-12" style="margin-top: clamp(24px, 5vw, 32px); padding-top: clamp(24px, 5vw, 32px); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                    <div>
                        <p style="font-size: clamp(24px, 5vw, 32px); color: #FFB5C5; font-weight: 400;">2</p>
                        <p style="font-size: clamp(11px, 3vw, 12px); color: #FFFAF5; margin-top: 8px;">Rooms Available</p>
                    </div>
                    <div>
                        <p style="font-size: clamp(24px, 5vw, 32px); color: #FFB5C5; font-weight: 400;">24/7</p>
                        <p style="font-size: clamp(11px, 3vw, 12px); color: #FFFAF5; margin-top: 8px;">Concierge Service</p>
                    </div>
                </div>

                <a href="/login" class="inline-block px-6 sm:px-8 md:px-10 py-3 sm:py-4 mt-8 sm:mt-10 text-center hover:bg-white/10 transition" style="border: 1px solid #FFFAF5; color: #FFFAF5; font-size: clamp(13px, 3.5vw, 14px); font-weight: 500; background: transparent;">
                    Explore Our Rooms
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Testimonial Section -->
<section class="py-12 sm:py-16 md:py-20 lg:py-24" style="background: #FFFAF5;">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="flex gap-2 justify-center mb-6 sm:mb-8 md:mb-10">
            @for ($i = 0; $i < 5; $i++)
            <svg class="w-5 h-5 sm:w-6 sm:h-6" style="color: #C9A962;" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            @endfor
        </div>

        <blockquote style="font-size: clamp(20px, 5vw, 36px); font-weight: 400; line-height: 1.3; color: #3D5A4C; text-align: center;">
            "An oasis of calm in a chaotic world. The attention to detail is simply unmatched."
        </blockquote>

        <p style="margin-top: clamp(20px, 5vw, 32px); font-size: clamp(10px, 3vw, 12px); font-weight: 700; color: rgba(61, 90, 76, 0.6);">
            — Jonathan V., Travel Weekly
        </p>
    </div>
</section>
@endsection
