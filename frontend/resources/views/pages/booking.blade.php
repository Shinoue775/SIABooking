@extends('layouts.app')

@section('content')
<div class="min-h-screen" style="background: linear-gradient(135deg, #FFFAF5 0%, #FFF5F5 50%, #FFFAF5 100%);">
    <div class="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16">
        <!-- Header -->
        <div class="text-center mb-8 sm:mb-12 md:mb-16">
            <div class="inline-block mb-4">
                <span style="font-size: 13px; font-weight: 700; color: #FFB5C5; font-family: 'Inter', sans-serif; letter-spacing: 3px; background: rgba(255, 181, 197, 0.1); padding: 8px 24px; border-radius: 20px; border: 1px solid rgba(255, 181, 197, 0.3);">
                    RESERVATION
                </span>
            </div>
            <h1 class="font-cormorant relative" style="font-size: clamp(36px, 8vw, 56px); font-weight: 400; color: #3D5A4C; text-shadow: 0px 2px 4px rgba(61, 90, 76, 0.05);">
                Secure Your Stay
                <div style="width: 80px; height: 2px; background: linear-gradient(90deg, #FFB5C5, #C9A962); margin: 16px auto 0; border-radius: 2px;"></div>
            </h1>
            <p class="text-gray-500 mt-4 text-sm">Fill out the form below to complete your reservation</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto relative">
            <!-- LEFT COLUMN - Booking Form (Scrolls normally) -->
            <div class="flex-1 space-y-6">
                <!-- 1. Personal Information -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">1</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Personal Information</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input type="text" id="fullName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="MarkJoheun Kim">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input type="email" id="email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="Mkim@example.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                            <input type="tel" id="contact" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="+63 912 345 6789">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input type="text" id="address" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="Your address">
                        </div>
                    </div>
                </div>

                <!-- 2. Room Selection -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">2</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Select Your Room</h3>
                    </div>
                    
                    <div class="mb-4">
                        <label for="roomTypeSearch" class="block text-sm font-medium text-gray-700 mb-1">Search Room Type</label>
                        <input type="search" id="roomTypeSearch" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition" placeholder="Search room by name or type">
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="roomTypeContainer">
                        <label class="relative cursor-pointer room-option" id="roomOptionStandard">
                            <input type="radio" name="roomType" value="standard" class="peer sr-only" checked>
                            <div class="border-2 rounded-xl p-4 peer-checked:border-green-600 peer-checked:bg-green-50 transition-all">
                                <h4 class="font-bold text-gray-800" id="roomLabelStandard">Standard Room B</h4>
                                <p class="text-2xl font-bold text-green-700 mt-2" id="roomPriceStandard">₱2,500</p>
                                <p class="text-xs text-gray-500 mt-1">per night</p>
                                <div class="flex flex-wrap gap-1 mt-3" id="roomTagsStandard">
                                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">Standard</span>
                                </div>
                            </div>
                        </label>
                        <label class="relative cursor-pointer room-option" id="roomOptionDeluxe">
                            <input type="radio" name="roomType" value="deluxe" class="peer sr-only">
                            <div class="border-2 rounded-xl p-4 peer-checked:border-green-600 peer-checked:bg-green-50 transition-all">
                                <h4 class="font-bold text-gray-800" id="roomLabelDeluxe">Deluxe Room A</h4>
                                <p class="text-2xl font-bold text-green-700 mt-2" id="roomPriceDeluxe">₱4,500</p>
                                <p class="text-xs text-gray-500 mt-1">per night</p>
                                <div class="flex flex-wrap gap-1 mt-3" id="roomTagsDeluxe">
                                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">Deluxe</span>
                                </div>
                            </div>
                        </label>
                    </div>
                    <p id="roomTypeEmpty" class="text-sm text-gray-500 mt-3 hidden">No room type matched your search.</p>
                    <p id="roomTypeDataNotice" class="text-sm text-amber-700 mt-3 hidden" data-loading-text="Loading real room data..." data-error-text="Real room data is currently unavailable. Please try again later.">Loading real room data...</p>
                </div>

                <!-- 3. Guest Categories -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">3</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Guest Details</h3>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-3xl mb-2">👨</div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Adults (13+)</label>
                            <div class="flex items-center justify-center gap-4">
                                <button type="button" onclick="updateGuestCount('adults', -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">−</button>
                                <span id="adultsCount" class="text-xl font-bold w-8 text-center">2</span>
                                <button type="button" onclick="updateGuestCount('adults', 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">+</button>
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-3xl mb-2">🧒</div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Kids (3-12)</label>
                            <div class="flex items-center justify-center gap-4">
                                <button type="button" onclick="updateGuestCount('kids', -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">−</button>
                                <span id="kidsCount" class="text-xl font-bold w-8 text-center">0</span>
                                <button type="button" onclick="updateGuestCount('kids', 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">+</button>
                            </div>
                        </div>
                        <div class="text-center p-4 bg-gray-50 rounded-xl">
                            <div class="text-3xl mb-2">👶</div>
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Infants (0-2)</label>
                            <div class="flex items-center justify-center gap-4">
                                <button type="button" onclick="updateGuestCount('infants', -1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">−</button>
                                <span id="infantsCount" class="text-xl font-bold w-8 text-center">0</span>
                                <button type="button" onclick="updateGuestCount('infants', 1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">+</button>
                            </div>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 text-center mt-4">Maximum 4 persons per room (Adults + Kids)</p>
                </div>

                <!-- 4. Date Selection with Calendar -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">4</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Select Dates</h3>
                    </div>
                    
                    <!-- Calendar Navigation -->
                    <div class="flex items-center justify-between mb-6">
                        <button type="button" id="prevMonth" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div class="text-center">
                            <span id="currentMonthYear" class="text-xl font-semibold text-gray-800">May 2026</span>
                        </div>
                        <button type="button" id="nextMonth" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition flex items-center justify-center">
                            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="border rounded-xl overflow-hidden">
                        <!-- Weekday Headers -->
                        <div class="grid grid-cols-7 bg-gray-50 border-b">
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Sun</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Mon</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Tue</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Wed</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Thu</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Fri</div>
                            <div class="py-3 text-center text-sm font-semibold text-gray-600">Sat</div>
                        </div>
                        
                        <!-- Calendar Days -->
                        <div id="calendarDays" class="grid grid-cols-7 bg-white">
                            <!-- Days will be populated by JavaScript -->
                        </div>
                    </div>
                    
                    <!-- Selected Dates Display -->
                     <div class="mt-6 pt-4 border-t border-gray-100">
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-3 rounded-lg" id="checkInDisplay" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.2);">
                                <p class="text-xs text-gray-500 mb-1">CHECK-IN DATE</p>
                                <p class="text-lg font-semibold text-green-700" id="selectedCheckIn">Not selected</p>
                                <p class="text-xs text-gray-400 mt-1">Check-in time: 3:00 PM</p>
                            </div>
                            <div class="p-3 rounded-lg" id="checkOutDisplay" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.2);">
                                <p class="text-xs text-gray-500 mb-1">CHECK-OUT DATE</p>
                                <p class="text-lg font-semibold text-green-700" id="selectedCheckOut">Not selected</p>
                                <p class="text-xs text-gray-400 mt-1">Check-out time: 11:00 AM</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Check-in Time</label>
                                <input type="time" id="checkInTime" value="15:00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-500 mb-1">Check-out Time</label>
                                <input type="time" id="checkOutTime" value="11:00" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition">
                            </div>
                        </div>
                        <input type="hidden" id="checkInDate">
                        <input type="hidden" id="checkOutDate">
                        
                        <!-- Nights Summary -->
                        <div id="nightsSummary" class="mt-4 p-3 bg-green-50 rounded-lg text-center hidden">
                            <p class="text-sm text-green-700">
                                <span id="totalNights">0</span> night(s) selected
                            </p>
                        </div>
                    </div>
                    
                    <!-- Available Dates Preview -->
                    <div class="mt-4 pt-3">
                        <p class="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                            Available dates
                            <span class="w-2 h-2 bg-gray-300 rounded-full ml-2"></span>
                            Unavailable
                            <span class="w-2 h-2 bg-green-700 rounded-full ml-2"></span>
                            Selected
                        </p>
                    </div>
                </div>

                <!-- 5. Extras & Discounts -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">5</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Extras & Discounts</h3>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <button type="button" id="amenitiesToggle" class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition" aria-expanded="false" aria-controls="amenitiesPanel">
                                <span class="font-semibold text-gray-800">Amenities</span>
                                <span class="flex items-center gap-2">
                                    <span class="text-xs text-gray-500" id="amenitiesSummaryText">Select amenities</span>
                                    <svg id="amenitiesToggleIcon" class="w-4 h-4 text-gray-500 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                                </span>
                            </button>
                            <div id="amenitiesPanel" class="hidden mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="amenitiesList">
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Air Conditioning" data-price="300"> Air Conditioning (+₱300/night)</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Smart TV" data-price="0"> Smart TV</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="WiFi" data-price="0"> WiFi</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Breakfast" data-price="150"> Breakfast (+₱150/night)</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Bathtub" data-price="0"> Bathtub</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Mini Sala" data-price="0"> Mini Sala</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Cabinet" data-price="0"> Cabinet</label>
                                    <label class="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" class="amenityOption" value="Shower" data-price="0"> Shower</label>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <span class="font-semibold text-gray-800">🛏️ Extra Bed</span>
                                <p class="text-xs text-gray-500">₱700 per night</p>
                            </div>
                            <div class="flex items-center gap-4">
                                <button type="button" onclick="updateExtraBeds(-1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">−</button>
                                <span id="extraBedsCount" class="text-xl font-bold w-8 text-center">0</span>
                                <button type="button" onclick="updateExtraBeds(1)" class="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition text-lg font-bold">+</button>
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- PWD Discount -->
                            <label class="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition-all duration-300" id="pwdLabel">
                                <div class="flex items-start gap-3">
                                    <input type="checkbox" id="pwdDiscount" onchange="updateDiscounts('pwd')" class="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1">
                                    <div>
                                        <span class="font-semibold text-gray-800">♿ PWD Discount</span>
                                        <p class="text-xs text-gray-500">20% off - Valid ID required</p>
                                    </div>
                                </div>
                                <div id="pwdDiscountControls" class="hidden p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-semibold text-green-800">PWD Guests</span>
                                        <span id="pwdDiscountCount" class="text-sm font-semibold text-green-800">0</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <button type="button" onclick="updateDiscountGuestCount('pwd', -1)" class="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 transition text-lg font-bold text-green-800">−</button>
                                        <button type="button" onclick="updateDiscountGuestCount('pwd', 1)" class="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 transition text-lg font-bold text-green-800">+</button>
                                        <span class="text-xs text-green-700" id="pwdDiscountLimitText">Max: 0</span>
                                    </div>
                                </div>
                            </label>
                            
                            <!-- Senior Citizen Discount -->
                            <label class="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition-all duration-300" id="seniorLabel">
                                <div class="flex items-start gap-3">
                                    <input type="checkbox" id="seniorDiscount" onchange="updateDiscounts('senior')" class="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1">
                                    <div>
                                        <span class="font-semibold text-gray-800">👴 Senior Citizen Discount</span>
                                        <p class="text-xs text-gray-500">20% off - Valid ID required</p>
                                    </div>
                                </div>
                                <div id="seniorDiscountControls" class="hidden p-3 bg-green-50 border border-green-200 rounded-xl">
                                    <div class="flex items-center justify-between mb-2">
                                        <span class="text-xs font-semibold text-green-800">Senior Guests</span>
                                        <span id="seniorDiscountCount" class="text-sm font-semibold text-green-800">0</span>
                                    </div>
                                    <div class="flex items-center gap-3">
                                        <button type="button" onclick="updateDiscountGuestCount('senior', -1)" class="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 transition text-lg font-bold text-green-800">−</button>
                                        <button type="button" onclick="updateDiscountGuestCount('senior', 1)" class="w-9 h-9 rounded-full bg-green-100 hover:bg-green-200 transition text-lg font-bold text-green-800">+</button>
                                        <span class="text-xs text-green-700" id="seniorDiscountLimitText">Max: 0</span>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <!-- Clear Selection Button (shows only when a discount is selected) -->
                        <div id="clearDiscountBtn" class="hidden">
                        </div>
                    </div>
                </div>

                <!-- 6. Payment & Receipt Upload -->
                <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100">
                        <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span class="text-green-700 font-bold text-sm">6</span>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800">Payment Method</h3>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <label class="flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer has-[:checked]:border-green-600 has-[:checked]:bg-green-50 transition">
                                <input type="radio" name="paymentMethod" value="gcash" class="w-4 h-4 text-green-600" checked>
                                <span class="text-xl">📱</span>
                                <div>
                                    <span class="font-semibold text-gray-800">GCash</span>
                                    <p class="text-xs text-gray-500">Online payment</p>
                                </div>
                            </label>
                        </div>
                        
                    </div>
                </div>

                        <!-- Booking Confirmation Modal -->
                        <div id="bookingModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 overflow-auto">
                            <div class="bg-white rounded-xl p-6 w-full max-w-xl mx-4 shadow-lg max-h-[85vh] overflow-hidden">
                                <h3 id="bookingModalTitle" class="text-lg font-semibold mb-4">Booking Status</h3>
                                <div id="bookingModalContent" class="text-sm text-gray-700 space-y-2 overflow-y-auto overflow-x-hidden max-h-[65vh]">
                                    <!-- populated by JS -->
                                </div>
                                <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                                    <button id="bookingModalClose" class="px-4 py-2 bg-gray-200 rounded-lg">Close</button>
                                    <button id="bookingModalDownload" class="hidden px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 hover:border-green-600 hover:text-green-700 transition inline-flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-700">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                            <polyline points="7 10 12 15 17 10"/>
                                            <line x1="12" y1="15" x2="12" y2="3"/>
                                        </svg>
                                        Download Receipt
                                    </button>
                                    <button id="bookingModalContinue" class="px-4 py-2 bg-green-600 text-white rounded-lg">Continue</button>
                                </div>
                            </div>
                        </div>

                        <div id="paymentModal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50 overflow-auto">
                            <div class="relative bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-lg max-h-[90vh] overflow-hidden">
                                <div id="paymentLoadingOverlay" class="hidden absolute inset-0 z-20 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center px-6">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
                                        <div class="text-gray-800 text-sm font-semibold">Processing payment and confirming booking...</div>
                                    </div>
                                </div>
                                <h3 class="text-lg font-semibold mb-4">Confirm Payment</h3>
                                <div id="paymentModalBody" class="space-y-4 text-sm text-gray-700 overflow-y-auto max-h-[70vh] pr-2">
                                    <p>Please select a payment option and upload your GCash receipt. Booking cannot continue until payment proof is provided.</p>
                                    <div id="paymentBookingDetails" class="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700"></div>
                                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <div class="font-semibold mb-2">Select payment choice</div>
                                        <div class="grid grid-cols-1 gap-3">
                                            <button type="button" id="paymentOptionPartial" class="payment-option-button rounded-xl border border-gray-300 p-4 text-left">
                                                <div class="font-semibold">Partial payment 50%</div>
                                                <div class="text-xs text-gray-500">Pay now and settle the rest on arrival. Non-refundable.</div>
                                                <div class="mt-2 text-lg font-bold text-green-700" id="paymentPartialAmount"></div>
                                            </button>
                                            <button type="button" id="paymentOptionFull" class="payment-option-button rounded-xl border border-gray-300 p-4 text-left">
                                                <div class="font-semibold">Full payment</div>
                                                <div class="text-xs text-gray-500">Pay the full amount now.</div>
                                                <div class="mt-2 text-lg font-bold text-green-700" id="paymentFullAmount"></div>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                        <div class="font-semibold mb-2">Payment Method</div>
                                        <label class="flex items-center gap-2 mb-2">
                                            <input type="radio" name="receiptPaymentMethod" value="gcash" checked disabled class="w-4 h-4 text-green-600">
                                            <span>GCash</span>
                                        </label>
                                        <label class="flex items-center gap-2 text-gray-400">
                                            <input type="radio" name="receiptPaymentMethod" value="card" disabled class="w-4 h-4 text-gray-400">
                                            <span>Card (Unavailable)</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">Amount paid with GCash</label>
                                        <input type="number" min="0" step="1" id="paymentAmountInput" class="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800" placeholder="Enter amount paid now">
                                        <p id="paymentAmountHint" class="text-xs text-gray-500 mt-2">Enter the amount you are paying now. For partial payment, minimum is 50% of the total.</p>
                                        <div id="paymentBalanceText" class="mt-2 text-sm font-semibold text-gray-700"></div>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-semibold text-gray-700 mb-2">Upload GCash Receipt</label>
                                        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer" id="paymentUploadArea">
                                            <input type="file" id="paymentReceiptFile" accept="image/*,.pdf" class="hidden">
                                            <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            <p class="text-sm text-gray-600">Click or drag to upload receipt</p>
                                            <p class="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                                        </div>
                                        <div id="paymentReceiptName" class="text-xs text-green-600 mt-2 hidden"></div>
                                    </div>
                                    <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                                        <p class="font-semibold">Important</p>
                                        <p>Please save or screenshot this receipt and show it to the front desk upon arrival.</p>
                                    </div>
                                </div>
                                <div class="mt-4 sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 pt-4">
                                    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <button type="button" onclick="closePaymentModal()" class="w-full sm:w-auto px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
                                        <button type="button" id="paymentConfirmButton" class="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg">Paid</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

            <!-- RIGHT COLUMN - Sticky Summary Sidebar -->
            <div class="lg:w-96">
                <div class="booking-summary-sticky" style="background: linear-gradient(135deg, #3D5A4C 0%, #2D4A3C 100%); padding: 24px; border-radius: 16px; box-shadow: 0px 16px 48px rgba(61, 90, 76, 0.25);">
                    <div class="mb-6">
                        <h2 class="font-cormorant text-2xl text-white mb-2">Booking Summary</h2>
                        <div class="w-12 h-0.5 bg-gradient-to-r from-pink-400 to-amber-400 rounded"></div>
                    </div>

                    <div class="pb-4 mb-4 border-b border-white/20">
                        <p class="text-white/60 text-xs uppercase tracking-wide mb-1">Selected Room</p>
                        <p class="text-white font-semibold" id="summaryRoom">Standard Room B</p>
                        <p class="text-green-300 text-sm" id="summaryRoomPrice">₱2,500 / night</p>
                    </div>

                    <div class="pb-4 mb-4 border-b border-white/20">
                        <p class="text-white/60 text-xs uppercase tracking-wide mb-1">Dates</p>
                        <p class="text-white text-sm" id="summaryCheckIn">Check-in: Not selected</p>
                        <p class="text-white text-sm" id="summaryCheckOut">Check-out: Not selected</p>
                        <p class="text-green-300 text-sm mt-1" id="summaryNights">0 nights</p>
                    </div>

                    <div class="pb-4 mb-4 border-b border-white/20">
                        <p class="text-white/60 text-xs uppercase tracking-wide mb-1">Guests</p>
                        <p class="text-white text-sm" id="summaryAdults">Adults: 2</p>
                        <p class="text-white text-sm" id="summaryKids">Kids (3-12): 0</p>
                        <p class="text-white/60 text-sm" id="summaryInfants">Infants (0-2): 0 (free)</p>
                        <p class="text-white text-sm" id="summaryExtraBeds">Extra Beds: 0</p>
                        <p class="text-white/80 text-xs mt-2" id="summaryAmenitiesList">Amenities: None</p>
                    </div>

                    <div class="pb-4 mb-4 border-b border-white/20">
                        <p class="text-white/60 text-xs uppercase tracking-wide mb-2">Cost Breakdown</p>
                        <div class="space-y-2">
                            <div class="flex justify-between">
                                <span class="text-white/70 text-sm">Room Rate</span>
                                <span class="text-white text-sm" id="costRoomRate">₱0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/70 text-sm">Extra Beds</span>
                                <span class="text-white text-sm" id="costExtraBeds">₱0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/70 text-sm">Amenities</span>
                                <span class="text-white text-sm" id="costAmenities">₱0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/70 text-sm">Subtotal</span>
                                <span class="text-white text-sm" id="costSubtotal">₱0</span>
                            </div>
                            <div class="flex justify-between" id="discountRow" style="display: none;">
                                <span class="text-green-300 text-sm">Discount (20%)</span>
                                <span class="text-green-300 text-sm" id="costDiscount">-₱0</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-white/70 text-sm">Service Charge</span>
                                <span class="text-white text-sm" id="costServiceCharge">₱85</span>
                            </div>
                        </div>
                    </div>

                    <div class="mb-6 p-4 bg-white/10 rounded-xl">
                        <div class="flex justify-between items-center">
                            <span class="text-white font-semibold">Total Amount</span>
                            <span class="text-2xl font-bold text-pink-300" id="totalAmount">₱0</span>
                        </div>
                        <p class="text-white/50 text-xs mt-2">*Service charge already included</p>
                    </div>

                    <button onclick="submitBooking()" class="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 rounded-xl font-semibold transition-all transform hover:scale-[1.02] shadow-lg">
                        Confirm Booking
                    </button>

                    <p class="text-white/40 text-xs text-center mt-4">⚠️ Reservations not checked in by 9:00 PM are forfeited</p>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    /* Fixed Sticky Sidebar */
    .booking-summary-sticky {
        position: sticky;
        top: 100px;
        transition: all 0.3s ease;
    }

    /* Calendar Styles */
    .calendar-day {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        margin: 2px;
        min-height: 54px;
        border: 1px solid #e5e7eb;
        background-color: #ffffff;
    }

    .calendar-day.empty {
        background-color: #f8fafc;
        border-color: #e5e7eb;
        cursor: default;
    }

    .calendar-day:hover:not(.disabled):not(.selected-start):not(.selected-end) {
        background-color: #f0fdf4;
        transform: scale(1.05);
    }

    .calendar-day.disabled {
        color: #d1d5db;
        cursor: not-allowed;
        background-color: #f9fafb;
        text-decoration: line-through;
    }

    .calendar-day.unavailable {
        color: #991b1b;
        cursor: not-allowed;
        background-color: #fee2e2;
        border-color: #fca5a5;
        text-decoration: line-through;
    }

    .calendar-day.selected-start {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        font-weight: bold;
    }

    .calendar-day.selected-end {
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        color: white;
        font-weight: bold;
    }

    .calendar-day.in-range {
        background-color: #dcfce7;
        color: #166534;
    }

    .calendar-day.today {
        border: 2px solid #22c55e;
        font-weight: bold;
    }

    .calendar-day .price-badge {
        font-size: 8px;
        margin-top: 2px;
        font-weight: normal;
    }

    .selected-start .price-badge,
    .selected-end .price-badge {
        color: rgba(255, 255, 255, 0.8);
    }

    /* Range selection indicator */
    .range-indicator {
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #22c55e;
    }

    /* Selected date displays */
    #checkInDisplay, #checkOutDisplay {
        transition: all 0.3s ease;
    }

    /* Responsive calendar */
    @media (max-width: 640px) {
        .calendar-day {
            font-size: 12px;
        }
        .calendar-day .price-badge {
            font-size: 7px;
        }
    }
    
    input[type="date"]::-webkit-calendar-picker-indicator {
        cursor: pointer;
        padding: 5px;
    }
    
    /* Ensure the sidebar doesn't overflow */
    @media (min-width: 1024px) {
        .booking-summary-sticky {
            max-height: calc(100vh - 120px);
            overflow-y: auto;
        }
        
        /* Custom scrollbar for sidebar */
        .booking-summary-sticky::-webkit-scrollbar {
            width: 4px;
        }
        
        .booking-summary-sticky::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        
        .booking-summary-sticky::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
        }
    }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-YcsIPn+CxQrjXKQ228oczr7VfMifoQf+sG+ECthkyMFS0QXOklxFAQ0OsB56nX8fN9nM5pkPp9RiiPqXoT2elg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
    // Guest counters
    let adults = 2;
    let kids = 0;
    let infants = 0;
    let extraBeds = 0;
    let roomType = 'standard';
    let pwdDiscount = false;
    let seniorDiscount = false;
    let pwdDiscountCount = 0;
    let seniorDiscountCount = 0;
    let hasRealRoomData = false;
    let isLoadingRoomData = true;

    // Calendar Variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedCheckIn = null;
    let selectedCheckOut = null;

    const BOOKING_API_BASE = @json(config('services.booking_api.base_url')) || window.location.origin;
    console.log('BOOKING_API_BASE_INIT', BOOKING_API_BASE);

    let unavailableDates = [];
    const dailyRates = {
        standard: 2500,
        deluxe: 4500,
    };
    const roomCatalog = {
        standard: { id: null, name: 'Standard Room B', tags: ['Standard'], raw: null },
        deluxe: { id: null, name: 'Deluxe Room A', tags: ['Deluxe'], raw: null },
    };
    let selectedAmenities = [];

    const roomRates = dailyRates;
    const EXTRA_BED_PRICE = 700;
    const SERVICE_CHARGE = 85;
    const DISCOUNT_RATE = 0.20;
    let pendingBookingPayload = null;
    let pendingBookingTotal = 0;
    let pendingBookingAmount = 0;
    let pendingPaymentAmountPaid = 0;
    let pendingPaymentBalance = 0;
    let pendingPaymentOption = 'partial';
    let pendingReceiptFile = null;
    let confirmedReceiptData = null;
    let isProcessingBooking = false;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const BASELINE_MONTH = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let availabilityRequestToken = 0;

    function formatLocalDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function combineDateAndTime(dateValue, timeValue) {
        const date = String(dateValue || '').trim();
        const time = String(timeValue || '').trim() || '00:00';
        return date ? `${date}T${time}:00` : '';
    }

    function hasUnavailableDateInRange(startDate, endDate) {
        if (!startDate || !endDate) return false;

        const current = new Date(startDate);
        const end = new Date(endDate);
        current.setDate(current.getDate() + 1);

        while (current < end) {
            if (unavailableDates.includes(formatLocalDate(current))) {
                return true;
            }
            current.setDate(current.getDate() + 1);
        }

        return false;
    }

    function getTodayAtMidnight() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    function getEligibleGuestCount() {
        return adults + kids + infants;
    }

    function updateRoomDataNotice() {
        const notice = document.getElementById('roomTypeDataNotice');
        if (!notice) return;
        notice.textContent = isLoadingRoomData
            ? (notice.dataset.loadingText || 'Loading real room data...')
            : (notice.dataset.errorText || 'Real room data is currently unavailable. Please try again later.');
        notice.classList.toggle('hidden', hasRealRoomData);
    }

    function applyRoomAvailabilityState() {
        const optionMap = [
            { key: 'standard', optionId: 'roomOptionStandard' },
            { key: 'deluxe', optionId: 'roomOptionDeluxe' },
        ];
        let firstAvailableType = null;
        optionMap.forEach(({ key, optionId }) => {
            const option = document.getElementById(optionId);
            const input = option?.querySelector('input[name="roomType"]');
            const available = Boolean(roomCatalog[key]?.id);
            if (!option || !input) return;
            option.style.display = available ? '' : 'none';
            input.disabled = !available;
            if (available && !firstAvailableType) firstAvailableType = key;
        });

        hasRealRoomData = Boolean(firstAvailableType);
        if (!hasRealRoomData) {
            unavailableDates = [];
            updateRoomDataNotice();
            renderCalendar();
            return;
        }

        if (!roomCatalog[roomType]?.id) {
            roomType = firstAvailableType;
            const activeInput = document.querySelector(`input[name="roomType"][value="${roomType}"]`);
            if (activeInput) activeInput.checked = true;
        }
        updateRoomDataNotice();
        filterRoomTypes();
    }

    function syncRoomSummary() {
        const activeRoom = roomCatalog[roomType];
        const roomPrice = roomRates[roomType] || 0;
        document.getElementById('summaryRoom').innerText = activeRoom?.name || 'Selected Room';
        document.getElementById('summaryRoomPrice').innerHTML = `₱${roomPrice.toLocaleString()} / night`;
    }

    function renderRoomCard(type) {
        const room = roomCatalog[type];
        if (!room) return;
        const labelEl = document.getElementById(type === 'standard' ? 'roomLabelStandard' : 'roomLabelDeluxe');
        const priceEl = document.getElementById(type === 'standard' ? 'roomPriceStandard' : 'roomPriceDeluxe');
        const tagsEl = document.getElementById(type === 'standard' ? 'roomTagsStandard' : 'roomTagsDeluxe');
        if (labelEl) labelEl.innerText = room.name;
        if (priceEl) priceEl.innerText = `₱${(roomRates[type] || 0).toLocaleString()}`;
        if (tagsEl) {
            tagsEl.innerHTML = '';
            (room.tags || []).forEach((tag) => {
                const span = document.createElement('span');
                span.className = 'text-xs bg-gray-100 px-2 py-1 rounded';
                span.innerText = tag;
                tagsEl.appendChild(span);
            });
        }
    }

    async function loadRoomsFromBackend() {
        isLoadingRoomData = true;
        updateRoomDataNotice();
        try {
            const response = await fetch(`${BOOKING_API_BASE}/api/rooms`);
            if (!response.ok) {
                isLoadingRoomData = false;
                hasRealRoomData = false;
                applyRoomAvailabilityState();
                return;
            }
            const rooms = await response.json();
            const sorted = Array.isArray(rooms) ? rooms : [];
            const roomAssignments = { standard: null, deluxe: null };
            sorted.forEach((room) => {
                if (String(room.status || 'available').toLowerCase() !== 'available') {
                    return;
                }
                const nestedType = Array.isArray(room.room_types) ? room.room_types[0] : room.room_types;
                const typeLabel = nestedType?.name || room.type_name || room.type || room.category || room.room_type || room.name || room.room_name || '';
                const normalizedType = String(typeLabel).toLowerCase();
                const preferredKey = normalizedType.includes('deluxe') ? 'deluxe' : 'standard';
                if (!roomAssignments[preferredKey]) {
                    roomAssignments[preferredKey] = room;
                } else if (!roomAssignments[preferredKey === 'deluxe' ? 'standard' : 'deluxe']) {
                    roomAssignments[preferredKey === 'deluxe' ? 'standard' : 'deluxe'] = room;
                }
            });

            Object.entries(roomAssignments).forEach(([key, room]) => {
                if (!room) {
                    roomCatalog[key].id = null;
                    return;
                }
                roomCatalog[key].id = room.id ?? null;
                const nestedType = Array.isArray(room.room_types) ? room.room_types[0] : room.room_types;
                const typeName = room.type_name || nestedType?.name || room.type || room.category || key;
                roomCatalog[key].name = room.name || room.room_name || `${typeName} ${room.room_number || ''}`.trim() || roomCatalog[key].name;
                roomCatalog[key].raw = room;
                roomCatalog[key].tags = [typeName, room.capacity ? `Up to ${room.capacity} guests` : null].filter(Boolean);
                const roomPrice = Number(room.price_per_night ?? room.rate ?? room.price ?? room.base_price ?? nestedType?.base_price);
                if (!Number.isNaN(roomPrice) && roomPrice > 0) {
                    roomRates[key] = roomPrice;
                }
                renderRoomCard(key);
            });
            isLoadingRoomData = false;
            applyRoomAvailabilityState();
            syncRoomSummary();
            updateSummary();
            await refreshAvailabilityForMonth();
        } catch (_error) {
            isLoadingRoomData = false;
            hasRealRoomData = false;
            applyRoomAvailabilityState();
            renderCalendar();
        }
    }

    function roomMatchesSelection(candidate, selectedRoomId, selectedRoomType) {
        const candidateId = String(candidate.id ?? '');
        const normalizedType = String(candidate.type || candidate.category || candidate.room_type || candidate.name || candidate.room_name || candidate.room_number || '').toLowerCase();
        const normalizedSelection = String(selectedRoomType || '').toLowerCase();

        if (selectedRoomId && candidateId === String(selectedRoomId)) {
            return true;
        }

        if (normalizedSelection && normalizedType.includes(normalizedSelection)) {
            return true;
        }

        return false;
    }

    function addUnavailableDatesRange(startDate, endDate) {
        if (!startDate || !endDate) return;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const addedDates = new Set(unavailableDates);

        while (start < end) {
            addedDates.add(formatLocalDate(start));
            start.setDate(start.getDate() + 1);
        }

        unavailableDates = Array.from(addedDates).sort();
    }

    async function refreshAvailabilityForMonth() {
        // Keep unavailable dates strictly scoped to the currently selected room.
        // Also avoid cross-room races by ignoring stale responses.
        const selectedRoomId = roomCatalog[roomType]?.id;
        const selectedRoomTypeForMatch = roomType;

        // If we don't have a backend room id for this toggle, show nothing unavailable.
        if (!selectedRoomId) {
            unavailableDates = [];
            renderCalendar();
            return;
        }

        const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${roomType}`;
        const requestToken = ++availabilityRequestToken;

        // Render immediately using cached results (if any) for speed.
        if (window.__availabilityCache?.[monthKey]) {
            unavailableDates = window.__availabilityCache[monthKey];
            renderCalendar();
        }

        // Preserve currently visible dates while we fetch fresh results.
        renderCalendar();

        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const today = getTodayAtMidnight();
        const todayStr = formatLocalDate(today);

        // Fetch in parallel but with a hard cap to avoid spamming the backend.
        const maxConcurrent = 6;
        const datesToCheck = [];
        for (let index = 0; index < daysInMonth; index++) {
            const dateValue = formatLocalDate(new Date(currentYear, currentMonth, index + 1));
            if (dateValue < todayStr) continue;
            datesToCheck.push(dateValue);
        }

        let cursor = 0;
        const results = [];

        const worker = async () => {
            while (cursor < datesToCheck.length) {
                const dateValue = datesToCheck[cursor++];
                try {
                    const response = await fetch(`${BOOKING_API_BASE}/api/rooms/availability?date=${dateValue}`);
                    const payload = response.ok ? await response.json() : null;
                    if (requestToken !== availabilityRequestToken) return;

                    const rooms = Array.isArray(payload?.rooms) ? payload.rooms : [];
                    const matchingRooms = rooms.filter((candidate) => {
                        return roomMatchesSelection(candidate, selectedRoomId, selectedRoomTypeForMatch);
                    });

                    if (matchingRooms.some((room) => room.available === false)) {
                        results.push(dateValue);
                    }
                } catch (_e) {
                    // ignore
                }
            }
        };

        await Promise.all(Array.from({ length: Math.min(maxConcurrent, Math.max(1, datesToCheck.length)) }, worker));
        if (requestToken !== availabilityRequestToken) return;

        // Normalize + update cache
        const nextDates = Array.from(new Set(results)).sort();
        unavailableDates = nextDates;

        window.__availabilityCache = window.__availabilityCache || {};
        window.__availabilityCache[monthKey] = unavailableDates;

        renderCalendar();
    }


    function filterRoomTypes() {
        const query = (document.getElementById('roomTypeSearch')?.value || '').trim().toLowerCase();
        const options = Array.from(document.querySelectorAll('.room-option'));
        let matches = 0;
        options.forEach((option) => {
            const input = option.querySelector('input[name="roomType"]');
            const isEnabled = input ? !input.disabled : true;
            const show = isEnabled && (!query || option.textContent.toLowerCase().includes(query));
            option.style.display = show ? '' : 'none';
            if (show) matches += 1;
        });
        document.getElementById('roomTypeEmpty')?.classList.toggle('hidden', matches > 0);
    }

    function getAmenitiesTotalPerNight() {
        return selectedAmenities.reduce((total, amenity) => total + (Number(amenity.price) || 0), 0);
    }

    function updateGuestCount(type, delta) {
        if (type === 'adults') {
            const newValue = adults + delta;
            if (newValue >= 1 && newValue <= 4 - kids) {
                adults = newValue;
                document.getElementById('adultsCount').innerText = adults;
            }
        } else if (type === 'kids') {
            const newValue = kids + delta;
            if (newValue >= 0 && newValue <= 4 - adults) {
                kids = newValue;
                document.getElementById('kidsCount').innerText = kids;
            }
        } else if (type === 'infants') {
            const newValue = infants + delta;
            if (newValue >= 0 && newValue <= 2) {
                infants = newValue;
                document.getElementById('infantsCount').innerText = infants;
            }
        }
        updateDiscountGuestControls();
        updateSummary();
    }

    function updateExtraBeds(delta) {
        const newValue = extraBeds + delta;
        if (newValue >= 0 && newValue <= 2) {
            extraBeds = newValue;
            document.getElementById('extraBedsCount').innerText = extraBeds;
            updateSummary();
        }
    }

    function updateDiscounts(selected) {
        const pwdCheckbox = document.getElementById('pwdDiscount');
        const seniorCheckbox = document.getElementById('seniorDiscount');
        const clearBtn = document.getElementById('clearDiscountBtn');
        
        if (selected === 'pwd') {
            pwdDiscount = pwdCheckbox.checked;
            if (!pwdDiscount) {
                pwdDiscountCount = 0;
            } else if (pwdDiscountCount < 1) {
                pwdDiscountCount = 1;
            }
        } else if (selected === 'senior') {
            seniorDiscount = seniorCheckbox.checked;
            if (!seniorDiscount) {
                seniorDiscountCount = 0;
            } else if (seniorDiscountCount < 1) {
                seniorDiscountCount = 1;
            }
        }
        
        if (pwdDiscount || seniorDiscount) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }

        updateDiscountGuestControls();
        updateSummary();
    }

    function updateDiscountGuestCount(type, delta) {
        const totalGuests = Math.max(getEligibleGuestCount(), 1);
        if (type === 'pwd' && pwdDiscount) {
            const maxPwd = Math.max(totalGuests - seniorDiscountCount, 1);
            pwdDiscountCount = Math.min(Math.max(pwdDiscountCount + delta, 1), maxPwd);
            document.getElementById('pwdDiscountCount').innerText = String(pwdDiscountCount);
        }
        if (type === 'senior' && seniorDiscount) {
            const maxSenior = Math.max(totalGuests - pwdDiscountCount, 1);
            seniorDiscountCount = Math.min(Math.max(seniorDiscountCount + delta, 1), maxSenior);
            document.getElementById('seniorDiscountCount').innerText = String(seniorDiscountCount);
        }
        updateDiscountGuestControls();
        updateSummary();
    }

    function updateDiscountGuestControls() {
        const maxEligible = Math.max(getEligibleGuestCount(), 1);
        const pwdControls = document.getElementById('pwdDiscountControls');
        const seniorControls = document.getElementById('seniorDiscountControls');
        const pwdLimitText = document.getElementById('pwdDiscountLimitText');
        const seniorLimitText = document.getElementById('seniorDiscountLimitText');

        if (pwdControls) {
            pwdControls.classList.toggle('hidden', !pwdDiscount);
            if (pwdLimitText) pwdLimitText.innerText = `Max: ${maxEligible}`;
            const countEl = document.getElementById('pwdDiscountCount');
            if (countEl) countEl.innerText = String(pwdDiscountCount || (pwdDiscount ? 1 : 0));
        }

        if (seniorControls) {
            seniorControls.classList.toggle('hidden', !seniorDiscount);
            if (seniorLimitText) seniorLimitText.innerText = `Max: ${maxEligible}`;
            const countEl = document.getElementById('seniorDiscountCount');
            if (countEl) countEl.innerText = String(seniorDiscountCount || (seniorDiscount ? 1 : 0));
        }
    }

    function clearDiscounts() {
        const pwdCheckbox = document.getElementById('pwdDiscount');
        const seniorCheckbox = document.getElementById('seniorDiscount');
        const clearBtn = document.getElementById('clearDiscountBtn');
        
        // Uncheck both checkboxes
        pwdCheckbox.checked = false;
        seniorCheckbox.checked = false;
        
        // Reset discount flags
        pwdDiscount = false;
        seniorDiscount = false;
        pwdDiscountCount = 0;
        seniorDiscountCount = 0;
        
        // Hide clear button
        clearBtn.classList.add('hidden');
        updateDiscountGuestControls();
        // Update summary
        updateSummary();
    }

    document.querySelectorAll('input[name="roomType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            roomType = this.value;
            syncRoomSummary();
            refreshAvailabilityForMonth();
            updateSummary();
        });
    });

    function renderCalendar() {
    const calendarDays = document.getElementById('calendarDays');
        if (!calendarDays) return;

        // When availability API is enabled, block selection strictly by room type.
        // For the UI, we re-render booked/unavailable dates based on the selected room.


        const currentMonthYear = document.getElementById('currentMonthYear');
        if (currentMonthYear) {
            currentMonthYear.innerHTML = `${monthNames[currentMonth]} ${currentYear}`;
        }

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        calendarDays.innerHTML = '';

        const totalCells = 42;

        for (let i = 0; i < totalCells; i++) {
            const dayNumber = i - firstDay + 1;
            const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
            let displayDate = null;
            let isDisabled = false;
            let dateStr = null;

            if (isCurrentMonth) {
                displayDate = new Date(currentYear, currentMonth, dayNumber);
                dateStr = formatLocalDate(displayDate);
            }

            const today = getTodayAtMidnight();
            const todayStr = formatLocalDate(today);
            const isToday = isCurrentMonth && dateStr === todayStr;
            const isPast = isCurrentMonth && displayDate < today;
            // Mark unavailable based on currently selected room type.
            const isUnavailable = isCurrentMonth && unavailableDates.includes(dateStr);

            const isCheckIn = isCurrentMonth && selectedCheckIn === dateStr;
            const isCheckOut = isCurrentMonth && selectedCheckOut === dateStr;

            let isInRange = false;
            if (selectedCheckIn && selectedCheckOut && !isCheckIn && !isCheckOut) {
                const checkInDate = new Date(selectedCheckIn);
                const checkOutDate = new Date(selectedCheckOut);
                isInRange = isCurrentMonth && displayDate > checkInDate && displayDate < checkOutDate;
            }

            isDisabled = isPast || isUnavailable;

            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';

            if (!isCurrentMonth) {
                dayDiv.classList.add('empty');
                calendarDays.appendChild(dayDiv);
                continue;
            }

            if (isUnavailable) dayDiv.classList.add('unavailable');
            if (isDisabled && !isUnavailable) dayDiv.classList.add('disabled');
            if (isCheckIn) dayDiv.classList.add('selected-start');
            if (isCheckOut) dayDiv.classList.add('selected-end');
            if (isInRange) dayDiv.classList.add('in-range');
            if (isToday && !isCheckIn && !isCheckOut) dayDiv.classList.add('today');

            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.innerText = Math.abs(dayNumber);
            dayNumberSpan.style.fontWeight = '500';
            dayDiv.appendChild(dayNumberSpan);

            if (isCurrentMonth && !isPast && !isUnavailable && Math.abs(dayNumber) <= daysInMonth) {
                const priceBadge = document.createElement('span');
                const rate = roomRates[roomType] || dailyRates[roomType] || 2500;
                priceBadge.className = 'price-badge';
                priceBadge.innerText = `₱${rate}`;
                dayDiv.appendChild(priceBadge);
            }

            if (isInRange) {
                const indicator = document.createElement('span');
                indicator.className = 'range-indicator';
                dayDiv.appendChild(indicator);
            }

            if (isUnavailable) {
                dayDiv.title = 'Booked / Unavailable';
            } else if (isPast) {
                dayDiv.title = 'Past date';
            }

            if (!isDisabled) {
                dayDiv.style.cursor = 'pointer';
                dayDiv.onclick = () => selectDate(displayDate);
            }

            calendarDays.appendChild(dayDiv);
        }
        updateCalendarNavigationButtons();
    }

    function selectDate(date) {
        const dateStr = formatLocalDate(date);
        const today = getTodayAtMidnight();

        if (date < today) {
            return;
        }

        if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
            selectedCheckIn = dateStr;
            selectedCheckOut = null;
            updateDateInputs();
        } else if (selectedCheckIn && !selectedCheckOut) {
            const checkInDate = new Date(selectedCheckIn);

            if (date > checkInDate) {
                if (hasUnavailableDateInRange(selectedCheckIn, dateStr)) {
                    alert('Your selected date range includes an occupied date. Please choose another check-out date.');
                    return;
                }
                selectedCheckOut = dateStr;
            } else if (date < checkInDate) {
                selectedCheckIn = dateStr;
                selectedCheckOut = null;
            }
            updateDateInputs();
        }

        renderCalendar();
    }

    function updateDateInputs() {
        const checkInDisplay = document.getElementById('selectedCheckIn');
        const checkOutDisplay = document.getElementById('selectedCheckOut');
        const nightsSummary = document.getElementById('nightsSummary');
        const totalNightsSpan = document.getElementById('totalNights');
        window.selectedCheckIn = selectedCheckIn;
        window.selectedCheckOut = selectedCheckOut;

        if (selectedCheckIn) {
            const checkInDate = new Date(selectedCheckIn);
            checkInDisplay.innerHTML = checkInDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            const checkInInput = document.getElementById('checkInDate');
            if (checkInInput) checkInInput.value = selectedCheckIn;
        } else {
            checkInDisplay.innerHTML = 'Not selected';
            const checkInInput = document.getElementById('checkInDate');
            if (checkInInput) checkInInput.value = '';
        }

        if (selectedCheckOut) {
            const checkOutDate = new Date(selectedCheckOut);
            checkOutDisplay.innerHTML = checkOutDate.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });

            const checkOutInput = document.getElementById('checkOutDate');
            if (checkOutInput) checkOutInput.value = selectedCheckOut;

            const nights = calculateNights(selectedCheckIn, selectedCheckOut);
            totalNightsSpan.innerHTML = nights;
            nightsSummary.classList.remove('hidden');

            window.checkInDate = selectedCheckIn;
            window.checkOutDate = selectedCheckOut;
            if (typeof updateSummary === 'function') updateSummary();
            if (typeof updateDateSummary === 'function') updateDateSummary();
        } else {
            checkOutDisplay.innerHTML = 'Not selected';
            const checkOutInput = document.getElementById('checkOutDate');
            if (checkOutInput) checkOutInput.value = '';
            nightsSummary.classList.add('hidden');
            window.checkOutDate = null;
        }

        if (typeof updateDateSummary === 'function') updateDateSummary();
    }

    function calculateNights(checkIn, checkOut) {
        if (!checkIn || !checkOut) return 0;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diffTime = Math.abs(outDate - inDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    function formatDate(dateString) {
        if (!dateString) return 'Not selected';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function updateAmenitiesSummary() {
        const summaryText = document.getElementById('amenitiesSummaryText');
        if (!summaryText) return;
        if (selectedAmenities.length === 0) {
            summaryText.innerText = 'Select amenities';
            return;
        }
        const amenitiesTotal = getAmenitiesTotalPerNight();
        summaryText.innerText = `${selectedAmenities.length} selected${amenitiesTotal > 0 ? ` (+₱${amenitiesTotal}/night)` : ''}`;
    }

    function bindAmenitiesHandlers() {
        document.getElementById('amenitiesToggle')?.addEventListener('click', () => {
            const panel = document.getElementById('amenitiesPanel');
            const toggle = document.getElementById('amenitiesToggle');
            const icon = document.getElementById('amenitiesToggleIcon');
            if (!panel || !toggle) return;
            const isHidden = panel.classList.toggle('hidden');
            toggle.setAttribute('aria-expanded', String(!isHidden));
            if (icon) icon.classList.toggle('rotate-180', !isHidden);
        });

        document.querySelectorAll('.amenityOption').forEach((input) => {
            input.addEventListener('change', () => {
                selectedAmenities = Array.from(document.querySelectorAll('.amenityOption:checked')).map((checkbox) => ({
                    name: checkbox.value,
                    price: Number(checkbox.dataset.price || 0),
                }));
                updateAmenitiesSummary();
                updateSummary();
            });
        });
    }

    document.getElementById('prevMonth')?.addEventListener('click', () => {
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        if (prevMonthDate < BASELINE_MONTH) {
            return;
        }
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        refreshAvailabilityForMonth();
    });

    document.getElementById('nextMonth')?.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        refreshAvailabilityForMonth();
    });

    function updateSummary() {
        const nights = (selectedCheckIn && selectedCheckOut) ? calculateNights(selectedCheckIn, selectedCheckOut) : 1;
        const rate = roomRates[roomType] || 0;
        const roomTotal = rate * nights;
        const extraBedsTotal = extraBeds * EXTRA_BED_PRICE * nights;
        const amenitiesTotal = getAmenitiesTotalPerNight() * nights;
        const subtotal = roomTotal + extraBedsTotal + amenitiesTotal;

        const eligibleGuests = Math.max(getEligibleGuestCount(), 1);
        const activePwdGuests = pwdDiscount ? Math.min(pwdDiscountCount, eligibleGuests) : 0;
        const activeSeniorGuests = seniorDiscount ? Math.min(seniorDiscountCount, eligibleGuests - activePwdGuests) : 0;
        const effectiveDiscountGuests = activePwdGuests + activeSeniorGuests;
        const perPersonShare = subtotal / eligibleGuests;
        const discountAmount = effectiveDiscountGuests > 0 ? Math.round(perPersonShare * DISCOUNT_RATE * effectiveDiscountGuests) : 0;
        const discountedSubtotal = subtotal - discountAmount;
        const total = discountedSubtotal + SERVICE_CHARGE;

        document.getElementById('summaryAdults').innerHTML = `Adults: ${adults}`;
        document.getElementById('summaryKids').innerHTML = `Kids (3-12): ${kids}`;
        document.getElementById('summaryInfants').innerHTML = `Infants (0-2): ${infants} (free)`;
        document.getElementById('summaryExtraBeds').innerHTML = `Extra Beds: ${extraBeds}`;
        document.getElementById('summaryAmenitiesList').innerHTML = `Amenities: ${selectedAmenities.length ? selectedAmenities.map((item) => item.name).join(', ') : 'None'}`;

        document.getElementById('costRoomRate').innerHTML = `₱${roomTotal.toLocaleString()}`;
        document.getElementById('costExtraBeds').innerHTML = `₱${extraBedsTotal.toLocaleString()}`;
        document.getElementById('costAmenities').innerHTML = `₱${amenitiesTotal.toLocaleString()}`;
        document.getElementById('costSubtotal').innerHTML = `₱${subtotal.toLocaleString()}`;

        const discountRow = document.getElementById('discountRow');
        const costDiscount = document.getElementById('costDiscount');
        
        if (effectiveDiscountGuests > 0) {
            discountRow.style.display = 'flex';
            const discountLabel = `Discount (20% × ${effectiveDiscountGuests} guest${effectiveDiscountGuests !== 1 ? 's' : ''})`;
            document.querySelector('#discountRow span:first-child').innerHTML = discountLabel;
            costDiscount.innerHTML = `-₱${discountAmount.toLocaleString()}`;
        } else {
            discountRow.style.display = 'none';
        }

        document.getElementById('totalAmount').innerHTML = `₱${total.toLocaleString()}`;
    }

    const fileNameSpan = document.getElementById('paymentReceiptName');

    function updateCalendarNavigationButtons() {
        const prevButton = document.getElementById('prevMonth');
        const nextButton = document.getElementById('nextMonth');
        const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
        if (prevButton) {
            const disabled = prevMonthDate < BASELINE_MONTH;
            prevButton.disabled = disabled;
            prevButton.classList.toggle('opacity-50', disabled);
            prevButton.classList.toggle('cursor-not-allowed', disabled);
        }
        if (nextButton) {
            nextButton.disabled = false;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }

    if (fileNameSpan) {
        fileNameSpan.classList.add('hidden');
    }

    function openPaymentModal(data) {
        const paymentModal = document.getElementById('paymentModal');
        const bookingDetails = document.getElementById('paymentBookingDetails');
        const partialAmount = document.getElementById('paymentPartialAmount');
        const fullAmount = document.getElementById('paymentFullAmount');
        const receiptName = document.getElementById('paymentReceiptName');
        const receiptInput = document.getElementById('paymentReceiptFile');

        if (!paymentModal || !bookingDetails || !partialAmount || !fullAmount || !receiptName || !receiptInput) {
            return;
        }

        pendingBookingTotal = data.total;
        pendingBookingAmount = data.partialAmount;
        pendingPaymentAmountPaid = data.partialAmount;
        pendingPaymentBalance = data.total - data.partialAmount;
        pendingPaymentOption = 'partial';
        pendingReceiptFile = null;

        partialAmount.textContent = `₱${data.partialAmount.toLocaleString()}`;
        fullAmount.textContent = `₱${data.total.toLocaleString()}`;
        receiptName.textContent = '';
        receiptName.classList.add('hidden');
        receiptInput.value = '';
        const paymentAmountInput = document.getElementById('paymentAmountInput');
        if (paymentAmountInput) {
            paymentAmountInput.value = data.partialAmount;
            paymentAmountInput.min = data.partialAmount;
            paymentAmountInput.max = data.total;
        }

        const discountSummary = [];
        if (data.pwdDiscount) discountSummary.push(`${data.pwdDiscountCount || 1} PWD`);
        if (data.seniorDiscount) discountSummary.push(`${data.seniorDiscountCount || 1} Senior`);
        const discountText = discountSummary.length ? discountSummary.join(' + ') : 'None';

        bookingDetails.innerHTML = `
            <div class="grid grid-cols-2 gap-3">
                <div class="font-semibold">Guest</div><div>${data.fullName}</div>
                <div class="font-semibold">Email</div><div>${data.email}</div>
                <div class="font-semibold">Contact</div><div>${data.contact}</div>
                <div class="font-semibold">Room</div><div>${data.roomName} (${data.roomType})</div>
                <div class="font-semibold">Dates</div><div>${data.checkIn} to ${data.checkOut}</div>
                <div class="font-semibold">Nights</div><div>${data.nights}</div>
                <div class="font-semibold">Guests</div><div>${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</div>
                <div class="font-semibold">Discount</div><div>${discountText}</div>
                <div class="font-semibold">Amenities</div><div>${data.amenities.length ? data.amenities.map((item) => item.name || item).join(', ') : 'None'}</div>
            </div>
        `;

        selectPaymentOption('partial');
        updatePaymentAmountInfo();
        paymentModal.classList.remove('hidden');
        paymentModal.classList.add('flex');
        updateCalendarNavigationButtons();
    }

    function closePaymentModal() {
        const paymentModal = document.getElementById('paymentModal');
        if (!paymentModal) return;
        paymentModal.classList.add('hidden');
        paymentModal.classList.remove('flex');
    }

    function selectPaymentOption(option) {
        const partialButton = document.getElementById('paymentOptionPartial');
        const fullButton = document.getElementById('paymentOptionFull');
        const paymentAmountInput = document.getElementById('paymentAmountInput');

        pendingPaymentOption = option;
        pendingBookingAmount = option === 'partial' ? Math.ceil(pendingBookingTotal / 2) : pendingBookingTotal;

        if (paymentAmountInput) {
            paymentAmountInput.min = pendingBookingAmount;
            paymentAmountInput.max = pendingBookingTotal;
            paymentAmountInput.value = pendingBookingAmount;
        }

        if (partialButton && fullButton) {
            partialButton.classList.toggle('border-green-600', option === 'partial');
            partialButton.classList.toggle('bg-green-50', option === 'partial');
            fullButton.classList.toggle('border-green-600', option === 'full');
            fullButton.classList.toggle('bg-green-50', option === 'full');
        }

        updatePaymentAmountInfo();
    }

    function formatCurrency(value) {
        return `₱${Number(value).toLocaleString()}`;
    }

    function updatePaymentAmountInfo() {
        const paymentAmountInput = document.getElementById('paymentAmountInput');
        const paymentAmountHint = document.getElementById('paymentAmountHint');
        const paymentBalanceText = document.getElementById('paymentBalanceText');
        const amount = paymentAmountInput ? Number(paymentAmountInput.value || 0) : 0;
        const total = pendingBookingTotal;
        const minAmount = pendingPaymentOption === 'partial' ? Math.ceil(total / 2) : total;

        pendingPaymentAmountPaid = amount;
        pendingPaymentBalance = Math.max(total - amount, 0);

        if (paymentAmountInput) {
            paymentAmountInput.min = minAmount;
            paymentAmountInput.max = total;
        }
        if (paymentAmountHint) {
            paymentAmountHint.textContent = pendingPaymentOption === 'partial'
                ? `Minimum ${formatCurrency(minAmount)}. Remaining balance due on arrival.`
                : `Enter the total amount of ${formatCurrency(total)}.`;
        }
        if (paymentBalanceText) {
            paymentBalanceText.textContent = pendingPaymentOption === 'partial'
                ? `Balance due on arrival: ${formatCurrency(pendingPaymentBalance)}`
                : (pendingPaymentBalance > 0 ? `Amount remaining: ${formatCurrency(pendingPaymentBalance)}` : 'No balance due.');
        }
    }

    function handlePaymentReceiptFile(file) {
        const paymentReceiptName = document.getElementById('paymentReceiptName');
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!file || !validTypes.includes(file.type)) {
            alert('Please upload PNG, JPG, or PDF file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Receipt file must be less than 5MB');
            return;
        }

        pendingReceiptFile = file;
        if (paymentReceiptName) {
            paymentReceiptName.textContent = `✅ ${file.name}`;
            paymentReceiptName.classList.remove('hidden');
        }
    }

    async function submitPaymentConfirmation() {
        if (isProcessingBooking) {
            return;
        }

        if (!pendingReceiptFile) {
            alert('Please upload your GCash receipt before continuing.');
            return;
        }

        const paymentAmountInput = document.getElementById('paymentAmountInput');
        const amount = paymentAmountInput ? Number(paymentAmountInput.value || 0) : 0;
        const minAmount = pendingPaymentOption === 'partial' ? Math.ceil(pendingBookingTotal / 2) : pendingBookingTotal;

        if (!amount || amount <= 0) {
            alert('Please enter the amount paid via GCash.');
            return;
        }
        if (amount < minAmount) {
            alert(`For ${pendingPaymentOption === 'partial' ? 'partial' : 'full'} payment, the minimum amount is ${formatCurrency(minAmount)}.`);
            return;
        }
        if (amount > pendingBookingTotal) {
            alert('The amount paid cannot exceed the total booking amount.');
            return;
        }
        if (pendingPaymentOption === 'full' && amount !== pendingBookingTotal) {
            alert(`Full payment must be exactly ${formatCurrency(pendingBookingTotal)}.`);
            return;
        }

        pendingPaymentAmountPaid = amount;
        pendingPaymentBalance = Math.max(pendingBookingTotal - amount, 0);

        if (pendingBookingPayload) {
            pendingBookingPayload.amount_paid = pendingPaymentAmountPaid;
            pendingBookingPayload.balance_due = pendingPaymentBalance;
            pendingBookingPayload.payment_choice = pendingPaymentOption;
        }

        isProcessingBooking = true;
        setPaymentLoading(true);
        await processBooking();
    }

    function setPaymentLoading(isLoading) {
        const paymentModal = document.getElementById('paymentModal');
        const paymentConfirmButton = document.getElementById('paymentConfirmButton');
        const cancelButton = paymentModal?.querySelector('button[onclick="closePaymentModal()"]');
        const overlay = document.getElementById('paymentLoadingOverlay');

        if (paymentConfirmButton) {
            paymentConfirmButton.disabled = isLoading;
            paymentConfirmButton.textContent = isLoading ? 'Processing...' : 'Paid';
            paymentConfirmButton.classList.toggle('opacity-50', isLoading);
            paymentConfirmButton.classList.toggle('cursor-not-allowed', isLoading);
        }
        if (cancelButton) {
            cancelButton.disabled = isLoading;
            cancelButton.classList.toggle('opacity-50', isLoading);
            cancelButton.classList.toggle('cursor-not-allowed', isLoading);
        }
        if (overlay) {
            overlay.classList.toggle('hidden', !isLoading);
        }
    }

    async function processBooking() {
        if (!pendingBookingPayload) {
            isProcessingBooking = false;
            setPaymentLoading(false);
            alert('Booking data is missing. Please try again.');
            return;
        }

        const bookingUrl = `${BOOKING_API_BASE}/api/bookings`;
        console.log('BOOKING_API_BASE', BOOKING_API_BASE, 'bookingUrl', bookingUrl);

        let authHeaders = {
            'Content-Type': 'application/json',
        };

        const client = window.supabaseClient;
        let session = null;

        if (client) {
            try {
                const { data } = await client.auth.getSession();
                session = data?.session ?? null;
                if (session?.access_token) {
                    authHeaders.Authorization = `Bearer ${session.access_token}`;
                }
            } catch (error) {
                console.warn('Unable to read auth session:', error);
            }
        }

        if (!session?.access_token) {
            isProcessingBooking = false;
            setPaymentLoading(false);
            closePaymentModal();
            showBookingStatusModal(
                false,
                'Login Required',
                '<p class="text-sm text-gray-700">Please sign in before confirming your booking.</p><p class="text-sm text-gray-700 mt-2">You will be redirected to the login page.</p>'
            );
            setTimeout(() => {
                window.location.href = '/login';
            }, 1200);
            return;
        }

        if (session?.user && session?.access_token) {
            try {
                const user = session.user;
                const profilePayload = {
                    id: user.id,
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
                };
                await fetch(`${BOOKING_API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify(profilePayload),
                });
                // Errors here are non-blocking — the backend uses upsert so duplicate calls are safe.
            } catch (e) {
                console.warn('User upsert before booking failed (non-blocking):', e);
            }
        }

        try {
            const response = await fetch(bookingUrl, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(pendingBookingPayload),
            });

            const result = await response.json().catch(() => ({}));
            console.log('Booking response status:', response.status, result);

            if (!response.ok) {
                console.error('Booking request failed:', response.status, result);
                isProcessingBooking = false;
                setPaymentLoading(false);
                closePaymentModal();

                if (response.status === 409) {
                    await refreshAvailabilityForMonth();
                    showBookingStatusModal(
                        false,
                        'Room No Longer Available',
                        '<p class="text-sm text-gray-700">Sorry, this room has already been booked for your selected dates by another guest. The calendar has been updated to show the latest availability — please choose different dates or a different room.</p>'
                    );
                } else {
                    const debugDetails = [result?.error, result?.message, result?.errors].filter(Boolean).join(' ');
                    const debugPayload = result?.payload ? `<pre class="text-xs text-gray-800 mt-2 p-2 bg-gray-100 rounded">${JSON.stringify(result.payload, null, 2)}</pre>` : '';
                    showBookingStatusModal(
                        false,
                        'Booking Failed',
                        (debugDetails || 'Unable to complete booking. Please try again.') + debugPayload
                    );
                }
                return;

            }

            confirmedReceiptData = {
                bookingId: result.id || null,
                fullName: pendingBookingPayload.guest_email ? document.getElementById('fullName').value : '',
                email: pendingBookingPayload.guest_email,
                contact: document.getElementById('contact').value,
                roomName: roomCatalog[pendingBookingPayload.room_type]?.name || pendingBookingPayload.room_type,
                roomType: pendingBookingPayload.room_type,
                checkIn: pendingBookingPayload.start_at,
                checkOut: pendingBookingPayload.end_at,
                nights: calculateNights(pendingBookingPayload.start_at, pendingBookingPayload.end_at),
                adults: adults,
                kids: kids,
                infants: infants,
                extraBeds: pendingBookingPayload.extra_beds,
                amenities: selectedAmenities,
                paymentMethod: pendingBookingPayload.payment_method,
                paymentChoice: pendingBookingPayload.payment_choice || pendingBookingPayload.paymentChoice,
                amountPaid: pendingBookingPayload.amount_paid,
                balanceDue: pendingBookingPayload.balance_due,
                total: pendingBookingPayload.total_price,
            };

            const receiptHtml = buildBookingReceiptHtml(confirmedReceiptData);

            closePaymentModal();
            addUnavailableDatesRange(pendingBookingPayload.start_at, pendingBookingPayload.end_at);
            refreshAvailabilityForMonth().catch((error) => {
                console.warn('Availability refresh after booking failed:', error);
            });
            isProcessingBooking = false;
            setPaymentLoading(false);
            showBookingStatusModal(true, 'Booking Confirmed', receiptHtml);
        } catch (error) {
            console.error('Booking submission failed (exception):', error);
            isProcessingBooking = false;
            setPaymentLoading(false);

            // Preserve the prior generic message, but include exception text.
            const fallback = 'Unable to complete booking. Please check your internet connection and try again.';
            const extra = error?.message ? `\n\nDetails: ${error.message}` : '';
            const details = fallback + extra;

            showBookingStatusModal(false, 'Booking Failed', details);
        }

    }

    async function submitBooking() {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const contact = document.getElementById('contact').value;

        if (!fullName || !email || !contact) {
            alert('Please fill in all required fields');
            return;
        }

        if (!selectedCheckIn || !selectedCheckOut) {
            alert('Please select check-in and check-out dates');
            return;
        }
        if (hasUnavailableDateInRange(selectedCheckIn, selectedCheckOut)) {
            alert('Your selected date range includes an occupied date. Please choose available dates only.');
            return;
        }
        if (!hasRealRoomData || !roomCatalog[roomType]?.id) {
            alert('Room data is unavailable. Please refresh and try again.');
            return;
        }

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        const nights = calculateNights(selectedCheckIn, selectedCheckOut);
        const rate = roomRates[roomType] || 0;
        const roomTotal = rate * nights;
        const extraBedsTotal = extraBeds * EXTRA_BED_PRICE * nights;
        const amenitiesTotal = getAmenitiesTotalPerNight() * nights;
        const subtotal = roomTotal + extraBedsTotal + amenitiesTotal;
        const eligibleGuests = Math.max(getEligibleGuestCount(), 1);
        const activePwdGuests = pwdDiscount ? Math.min(pwdDiscountCount, eligibleGuests) : 0;
        const activeSeniorGuests = seniorDiscount ? Math.min(seniorDiscountCount, eligibleGuests - activePwdGuests) : 0;
        const effectiveDiscountGuests = activePwdGuests + activeSeniorGuests;
        const perPersonShare = subtotal / eligibleGuests;
        const discountAmount = effectiveDiscountGuests > 0 ? Math.round(perPersonShare * DISCOUNT_RATE * effectiveDiscountGuests) : 0;
        const total = (subtotal - discountAmount) + SERVICE_CHARGE;
        const checkInTime = document.getElementById('checkInTime').value;
        const checkOutTime = document.getElementById('checkOutTime').value;

        const checkInFallback = document.getElementById('checkInDate')?.value || selectedCheckIn;
        const checkOutFallback = document.getElementById('checkOutDate')?.value || selectedCheckOut;
        const startAt = combineDateAndTime(checkInFallback, checkInTime || '15:00');
        const endAt = combineDateAndTime(checkOutFallback, checkOutTime || '11:00');

        // Hardening: ensure the payload room_id matches the currently selected room.
        const currentRoomId = roomCatalog[roomType]?.id;
        if (!currentRoomId) {
            alert('Room data is unavailable. Please refresh and try again.');
            return;
        }

        const bookingPayload = {
            room_id: currentRoomId,
            room_type: roomType,
            start_at: startAt,
            end_at: endAt,
            guests: adults + kids + infants,
            has_pwd: pwdDiscount,
            has_senior: seniorDiscount,
            pwd_count: pwdDiscountCount,
            senior_count: seniorDiscountCount,
            extra_beds: extraBeds,
            total_price: total,
            payment_method: selectedMethod,
            payment_choice: pendingPaymentOption,
            amount_paid: 0,
            balance_due: total,
            guest_email: email,
            amenities: selectedAmenities.map((item) => item.id).filter((id) => id !== undefined && id !== null),
        };

        pendingBookingPayload = bookingPayload;
        pendingBookingTotal = total;
        pendingBookingAmount = Math.ceil(total / 2);
        pendingPaymentOption = 'partial';
        pendingReceiptFile = null;
        openPaymentModal({
            fullName,
            email,
            contact,
            roomName: roomCatalog[roomType]?.name || roomType,
            roomType,
            checkIn: selectedCheckIn,
            checkOut: selectedCheckOut,
            nights,
            adults,
            kids,
            infants,
            pwdDiscount,
            seniorDiscount,
            pwdDiscountCount,
            seniorDiscountCount,
            extraBeds,
            amenities: selectedAmenities,
            paymentMethod: selectedMethod,
            total,
            partialAmount: Math.ceil(total / 2),
        });
        return;
    }

    let bookingStatusSuccess = false;

    function buildBookingReceiptHtml(data) {
        const amenitiesText = data.amenities.length
            ? data.amenities.map((item) => item.name || item).join(', ')
            : 'None';

        return `
            <div class="space-y-4 text-left">
                <p class="text-sm text-gray-700">Thank you <strong>${data.fullName}</strong>! Your booking is confirmed.</p>
                <div class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800">
                    <div class="font-semibold text-gray-900 mb-3">Booking Receipt</div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div class="font-semibold">Name:</div><div class="min-w-0 break-words">${data.fullName}</div>
                        <div class="font-semibold">Email:</div><div class="min-w-0 break-words">${data.email}</div>
                        <div class="font-semibold">Contact:</div><div class="min-w-0 break-words">${data.contact}</div>
                        <div class="font-semibold">Room:</div><div class="min-w-0 break-words">${data.roomName} (${data.roomType})</div>
                        <div class="font-semibold">Check-in:</div><div class="min-w-0 break-words">${data.checkIn}</div>
                        <div class="font-semibold">Check-out:</div><div class="min-w-0 break-words">${data.checkOut}</div>
                        <div class="font-semibold">Nights:</div><div class="min-w-0 break-words">${data.nights}</div>
                        <div class="font-semibold">Guests:</div><div class="min-w-0 break-words">${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</div>
                        <div class="font-semibold">Extra beds:</div><div class="min-w-0 break-words">${data.extraBeds}</div>
                        <div class="font-semibold">Amenities:</div><div class="min-w-0 break-words">${amenitiesText}</div>
                        <div class="font-semibold">Payment method:</div><div class="min-w-0 break-words">${data.paymentMethod}</div>
                        <div class="font-semibold">Payment choice:</div><div class="min-w-0 break-words">${data.payment_choice || data.paymentChoice || 'Partial'}</div>
                        <div class="font-semibold">Amount paid:</div><div class="min-w-0 break-words">₱${data.amountPaid?.toLocaleString() || '0'}</div>
                        <div class="font-semibold">Balance due:</div><div class="min-w-0 break-words">₱${data.balanceDue?.toLocaleString() || '0'}</div>
                    </div>
                    <div class="mt-4 rounded-lg bg-white p-3 border border-gray-200">
                        <div class="flex justify-between text-sm text-gray-700">
                            <span class="font-semibold">Amount due</span>
                            <span class="font-semibold">₱${data.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <p class="font-semibold mb-2">Important</p>
                    <p>Please save or screenshot this receipt and show it to the front desk upon arrival.</p>
                </div>
            </div>
        `;
    }

    function showBookingStatusModal(success, title, message) {
        bookingStatusSuccess = success;
        const bookingModal = document.getElementById('bookingModal');
        const bookingModalTitle = document.getElementById('bookingModalTitle');
        const bookingModalContent = document.getElementById('bookingModalContent');
        const bookingModalContinue = document.getElementById('bookingModalContinue');

        if (!bookingModal || !bookingModalTitle || !bookingModalContent || !bookingModalContinue) {
            alert(`${title}\n\n${message.replace(/<[^>]+>/g, '')}`);
            return;
        }

        bookingModalTitle.textContent = title;
        bookingModalTitle.classList.toggle('text-green-700', success);
        bookingModalTitle.classList.toggle('text-red-700', !success);
        bookingModalContent.innerHTML = message;
        bookingModalContinue.textContent = success ? 'Continue' : 'Try Again';

        const bookingModalDownload = document.getElementById('bookingModalDownload');
        if (bookingModalDownload) {
            bookingModalDownload.classList.toggle('hidden', !success);
        }
        bookingModalContinue.classList.toggle('bg-green-600', success);
        bookingModalContinue.classList.toggle('bg-red-600', !success);

        bookingModal.classList.remove('hidden');
        bookingModal.classList.add('flex');
    }

    function hideBookingStatusModal() {
        const bookingModal = document.getElementById('bookingModal');
        if (!bookingModal) return;
        bookingModal.classList.add('hidden');
        bookingModal.classList.remove('flex');
    }

    document.getElementById('bookingModalClose')?.addEventListener('click', hideBookingStatusModal);

    function downloadBookingReceipt() {
        const payload = pendingBookingPayload;
        if (!payload || !confirmedReceiptData) {
            alert('Booking data is not available for download yet.');
            return;
        }

        try {
            const receiptData = {
                ...confirmedReceiptData,
                propertyName: 'CHTM Booking',
                issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                amenities: Array.isArray(confirmedReceiptData.amenities) && confirmedReceiptData.amenities.length
                    ? confirmedReceiptData.amenities.map((item) => item.name || item).join(', ')
                    : 'None',
            };

            const receiptHtml = generateBookingPdfHtml(receiptData);
            const filenameBase = `booking-confirmation-${payload.room_type}-${receiptData.bookingId || Date.now()}`;

            const element = document.createElement('div');
            element.innerHTML = receiptHtml;
            element.style.padding = '20px';
            element.style.backgroundColor = '#ffffff';

            if (typeof html2pdf === 'undefined') {
                const blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"><title>Booking Receipt</title></head><body>${receiptHtml}</body></html>`], { type: 'text/html' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${filenameBase}.html`;
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(link.href);
                link.remove();
                return;
            }

            const options = {
                margin: 10,
                filename: `${filenameBase}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
                jsPDF: { unit: 'pt', format: 'letter', orientation: 'portrait', compress: true },
            };

            html2pdf()
                .set(options)
                .from(element)
                .save()
                .then(() => {
                    console.log('PDF downloaded successfully');
                })
                .catch((error) => {
                    console.error('PDF generation error:', error);
                    alert('Failed to generate PDF. Please try again.');
                });
        } catch (error) {
            console.error('Download receipt error:', error);
            alert('An error occurred while generating the receipt. Please try again.');
        }
    }

    function generateBookingPdfHtml(data) {
        const currency = (value) => `₱${Number(value).toLocaleString()}`;
        return `
            <div style="font-family: 'Inter', sans-serif; color: #1f2937; background: #ffffff; width: 820px; padding: 32px; box-sizing: border-box;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px;">
                    <div>
                        <div style="font-size: 24px; font-weight: 700; color: #0f5132; letter-spacing: 0.02em;">${data.propertyName || 'CHTM Booking'}</div>
                        <div style="margin-top: 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.16em; color: #4b5563;">BOOKING CONFIRMATION VOUCHER</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.12em;">Date of Issue</div>
                        <div style="font-size: 14px; font-weight: 600; color: #111827; margin-top: 4px;">${data.issueDate}</div>
                    </div>
                </div>

                <div style="margin: 28px 0; border-top: 1px solid #e5e7eb;"></div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; font-size: 13px; line-height: 1.7;">
                    <div>
                        <div style="font-weight: 700; color: #111827; margin-bottom: 10px;">Booking Details</div>
                        <div style="display: grid; gap: 10px;">
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Room</span><strong style="color:#111827;">${data.roomName} (${data.roomType})</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Check-in</span><strong style="color:#111827;">${data.checkIn}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Check-out</span><strong style="color:#111827;">${data.checkOut}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Duration</span><strong style="color:#111827;">${data.nights} Night${data.nights !== 1 ? 's' : ''}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Guests</span><strong style="color:#111827;">${data.adults} Adults, ${data.kids} Kids, ${data.infants} Infants</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Extra Beds</span><strong style="color:#111827;">${data.extraBeds}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Amenities</span><strong style="color:#111827;">${data.amenities}</strong></div>
                        </div>
                    </div>
                    <div>
                        <div style="font-weight: 700; color: #111827; margin-bottom: 10px;">Payment Summary</div>
                        <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 16px; padding: 18px; display: grid; gap: 14px;">
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Payment Method</span><strong style="color:#111827;">${data.paymentMethod}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Amount Paid</span><strong style="color:#111827;">${currency(data.amountPaid)}</strong></div>
                            <div style="display:flex; justify-content: space-between;"><span style="color:#4b5563;">Balance Due</span><strong style="color:#111827;">${currency(data.balanceDue)}</strong></div>
                            <div style="margin-top: 12px; padding: 16px; border-radius: 14px; background: #ecfdf5; border: 1px solid #d1fae5; display:flex; justify-content: space-between; align-items: center;">
                                <span style="font-size: 14px; font-weight: 700; color: #065f46;">Total Amount Due</span>
                                <span style="font-size: 18px; font-weight: 800; color: #065f46;">${currency(data.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="margin: 32px 0; border-top: 1px solid #e5e7eb;"></div>

                <div style="background: #f8fafc; border: 1px solid #e5e7eb; border-radius: 18px; padding: 24px;">
                    <div style="font-size: 14px; font-weight: 700; color: #0f5132; margin-bottom: 14px;">Important Instructions</div>
                    <ol style="padding-left: 18px; color: #374151; font-size: 13px; line-height: 1.8;">
                        <li>Present a printed copy or digital screenshot of this PDF receipt to the front desk officer upon arrival.</li>
                        <li>Standard check-in is at 2:00 PM. Early check-in is subject to room availability.</li>
                        <li>Please bring at least one valid government-issued ID matching the primary guest's name for verification.</li>
                        <li>Since the current amount paid is ${currency(data.amountPaid)}, please be ready to settle the total amount due of ${currency(data.total)} via GCash or Cash at the front desk before room entry.</li>
                    </ol>
                </div>

                <div style="margin-top: 28px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="color: #6b7280; font-size: 12px;">Thank you for your booking. We wish you a wonderful stay.</div>
                    <div style="color: #4b5563; font-size: 12px; font-weight: 700;">Front Desk | Guest Services</div>
                </div>
            </div>
        `;
    }
    document.getElementById('bookingModalContinue')?.addEventListener('click', () => {
        if (bookingStatusSuccess) {
            window.location.href = '/';
            return;
        }

        hideBookingStatusModal();
    });
    document.getElementById('bookingModalDownload')?.addEventListener('click', downloadBookingReceipt);

    document.getElementById('paymentOptionPartial')?.addEventListener('click', () => selectPaymentOption('partial'));
    document.getElementById('paymentOptionFull')?.addEventListener('click', () => selectPaymentOption('full'));
    document.getElementById('paymentUploadArea')?.addEventListener('click', () => {
        const paymentReceiptInput = document.getElementById('paymentReceiptFile');
        paymentReceiptInput?.click();
    });
    document.getElementById('paymentUploadArea')?.addEventListener('dragover', (e) => {
        e.preventDefault();
        document.getElementById('paymentUploadArea')?.classList.add('border-green-500', 'bg-green-50');
    });
    document.getElementById('paymentUploadArea')?.addEventListener('dragleave', () => {
        document.getElementById('paymentUploadArea')?.classList.remove('border-green-500', 'bg-green-50');
    });
    document.getElementById('paymentUploadArea')?.addEventListener('drop', (e) => {
        e.preventDefault();
        const paymentReceiptInput = document.getElementById('paymentReceiptFile');
        document.getElementById('paymentUploadArea')?.classList.remove('border-green-500', 'bg-green-50');
        const file = e.dataTransfer.files[0];
        if (file) handlePaymentReceiptFile(file);
    });
    document.getElementById('paymentReceiptFile')?.addEventListener('change', (e) => {
        if (e.target.files[0]) handlePaymentReceiptFile(e.target.files[0]);
    });
    document.getElementById('paymentAmountInput')?.addEventListener('input', updatePaymentAmountInfo);
    document.getElementById('paymentConfirmButton')?.addEventListener('click', submitPaymentConfirmation);

    window.updateDateSummary = function() {
        const checkInElement = document.getElementById('summaryCheckIn');
        const checkOutElement = document.getElementById('summaryCheckOut');
        const nightsElement = document.getElementById('summaryNights');

        if (checkInElement) {
            checkInElement.innerHTML = selectedCheckIn ? `Check-in: ${formatDate(selectedCheckIn)}` : 'Check-in: Not selected';
        }
        if (checkOutElement) {
            checkOutElement.innerHTML = selectedCheckOut ? `Check-out: ${formatDate(selectedCheckOut)}` : 'Check-out: Not selected';
        }
        if (nightsElement && selectedCheckIn && selectedCheckOut) {
            const nights = calculateNights(selectedCheckIn, selectedCheckOut);
            nightsElement.innerHTML = `${nights} night${nights !== 1 ? 's' : ''}`;
        } else if (nightsElement) {
            nightsElement.innerHTML = '0 nights';
        }
    };

    window.selectedCheckIn = selectedCheckIn;
    window.selectedCheckOut = selectedCheckOut;

    const roomQuery = (new URLSearchParams(window.location.search).get('room') || '').toLowerCase();
    if (roomQuery === 'a' || roomQuery === 'deluxe') {
        const deluxeOption = document.querySelector('input[name="roomType"][value="deluxe"]');
        if (deluxeOption) {
            deluxeOption.checked = true;
            roomType = 'deluxe';
        }
    } else if (roomQuery === 'b' || roomQuery === 'standard') {
        const standardOption = document.querySelector('input[name="roomType"][value="standard"]');
        if (standardOption) {
            standardOption.checked = true;
            roomType = 'standard';
        }
    }

    function initializeBookingPage() {
        document.getElementById('roomTypeSearch')?.addEventListener('input', filterRoomTypes);
        bindAmenitiesHandlers();
        renderCalendar();
        loadRoomsFromBackend();
        syncRoomSummary();
        refreshAvailabilityForMonth();
        updateSummary();
        updateAmenitiesSummary();
        window.updateDateSummary();
        renderCalendar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeBookingPage);
    } else {
        initializeBookingPage();
    }
</script>
@endsection
