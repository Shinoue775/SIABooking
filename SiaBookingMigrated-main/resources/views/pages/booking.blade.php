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
                            <div class="p-3 rounded-lg" id="checkOutDisplay" style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.2);">
                                <p class="text-xs text-gray-500 mb-1">CHECK-OUT DATE</p>
                                <p class="text-lg font-semibold text-green-700" id="selectedCheckOut">Not selected</p>
                                <p class="text-xs text-gray-400 mt-1">Check-out time: 11:00 AM</p>
                            </div>
                        </div>
                        
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
                            <button type="button" id="amenitiesToggle" class="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                                <span class="font-semibold text-gray-800">Amenities</span>
                                <span class="text-xs text-gray-500" id="amenitiesSummaryText">Select amenities</span>
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
                            <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition-all duration-300" id="pwdLabel">
                                <input type="checkbox" id="pwdDiscount" onchange="updateDiscounts('pwd')" class="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <div>
                                    <span class="font-semibold text-gray-800">♿ PWD Discount</span>
                                    <p class="text-xs text-gray-500">20% off - Valid ID required</p>
                                </div>
                            </label>
                            
                            <!-- Senior Citizen Discount -->
                            <label class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-green-50 transition-all duration-300" id="seniorLabel">
                                <input type="checkbox" id="seniorDiscount" onchange="updateDiscounts('senior')" class="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500">
                                <div>
                                    <span class="font-semibold text-gray-800">👴 Senior Citizen Discount</span>
                                    <p class="text-xs text-gray-500">20% off - Valid ID required</p>
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
                                <input type="radio" name="paymentMethod" value="gcash" class="w-4 h-4 text-green-600" checked onchange="togglePaymentMethod()">
                                <span class="text-xl">📱</span>
                                <div>
                                    <span class="font-semibold text-gray-800">GCash</span>
                                    <p class="text-xs text-gray-500">Online payment</p>
                                </div>
                            </label>
                        </div>
                        
                        <div id="receiptUpload" class="p-4 bg-gray-50 rounded-xl">
                            <label class="block text-sm font-semibold text-gray-700 mb-2">Upload Payment Receipt</label>
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer" id="uploadArea">
                                <input type="file" id="receiptFile" accept="image/*,.pdf" class="hidden">
                                <svg class="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <p class="text-sm text-gray-600">Click or drag to upload receipt</p>
                                <p class="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 5MB</p>
                            </div>
                            <div id="fileName" class="text-xs text-green-600 mt-2 hidden"></div>
                            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p class="text-xs text-blue-800">📌 GCash Number: <strong>0912 345 6789</strong> </p>
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

<script>
    // Guest counters
    let adults = 2;
    let kids = 0;
    let infants = 0;
    let extraBeds = 0;
    let roomType = 'standard';
    let pwdDiscount = false;
    let seniorDiscount = false;

    // Calendar Variables
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let selectedCheckIn = null;
    let selectedCheckOut = null;

    const BOOKING_API_BASE = @json(config('services.booking_api.base_url'));
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
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const BASELINE_MONTH = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let availabilityRequestToken = 0;

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
        try {
            const response = await fetch(`${BOOKING_API_BASE}/api/rooms`);
            if (!response.ok) return;
            const rooms = await response.json();
            const sorted = (Array.isArray(rooms) ? rooms : []).slice(0, 2);
            sorted.forEach((room, index) => {
                const key = index === 0 ? 'standard' : 'deluxe';
                roomCatalog[key].id = room.id ?? null;
                roomCatalog[key].name = room.name || room.room_name || room.room_number || roomCatalog[key].name;
                roomCatalog[key].raw = room;
                roomCatalog[key].tags = [room.type || room.category || key];
                const roomPrice = Number(room.price_per_night ?? room.rate ?? room.price ?? room.base_price);
                if (!Number.isNaN(roomPrice) && roomPrice > 0) {
                    roomRates[key] = roomPrice;
                }
                renderRoomCard(key);
            });
            syncRoomSummary();
            updateSummary();
            await refreshAvailabilityForMonth();
        } catch (_error) {
            // keep UI defaults when backend cannot be reached
        }
    }

    async function refreshAvailabilityForMonth() {
        const selectedRoomId = roomCatalog[roomType]?.id;
        if (!selectedRoomId) {
            unavailableDates = [];
            renderCalendar();
            return;
        }

        const requestToken = ++availabilityRequestToken;
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const checks = Array.from({ length: daysInMonth }, (_, index) => {
            const dateValue = new Date(currentYear, currentMonth, index + 1).toISOString().split('T')[0];
            return fetch(`${BOOKING_API_BASE}/api/rooms/availability?date=${dateValue}`)
                .then((response) => (response.ok ? response.json() : null))
                .then((payload) => {
                    const room = payload?.rooms?.find((candidate) => String(candidate.id) === String(selectedRoomId));
                    return room && room.available === false ? dateValue : null;
                })
                .catch(() => null);
        });

        const results = await Promise.all(checks);
        if (requestToken !== availabilityRequestToken) return;
        unavailableDates = results.filter(Boolean);
        renderCalendar();
    }

    function filterRoomTypes() {
        const query = (document.getElementById('roomTypeSearch')?.value || '').trim().toLowerCase();
        const options = Array.from(document.querySelectorAll('.room-option'));
        let matches = 0;
        options.forEach((option) => {
            const show = !query || option.textContent.toLowerCase().includes(query);
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
            if (pwdCheckbox.checked) {
                // If PWD is being checked, uncheck Senior
                seniorCheckbox.checked = false;
                pwdDiscount = true;
                seniorDiscount = false;
            } else {
                // If PWD is being unchecked
                pwdDiscount = false;
            }
        } else if (selected === 'senior') {
            if (seniorCheckbox.checked) {
                // If Senior is being checked, uncheck PWD
                pwdCheckbox.checked = false;
                seniorDiscount = true;
                pwdDiscount = false;
            } else {
                // If Senior is being unchecked
                seniorDiscount = false;
            }
        }
        
        // Show/hide clear button based on whether any discount is selected
        if (pwdDiscount || seniorDiscount) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
        
        updateSummary();
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
        
        // Hide clear button
        clearBtn.classList.add('hidden');
        
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

        document.getElementById('currentMonthYear').innerHTML = `${monthNames[currentMonth]} ${currentYear}`;

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
                dateStr = displayDate.toISOString().split('T')[0];
            }

            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const isToday = isCurrentMonth && dateStr === todayStr;
            const isPast = isCurrentMonth && displayDate < new Date(todayStr);
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

            if (isDisabled) dayDiv.classList.add('disabled');
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
                const rate = dailyRates[roomType] || 2500;
                priceBadge.className = 'price-badge';
                priceBadge.innerText = `₱${rate}`;
                dayDiv.appendChild(priceBadge);
            }

            if (isInRange) {
                const indicator = document.createElement('span');
                indicator.className = 'range-indicator';
                dayDiv.appendChild(indicator);
            }

            if (!isDisabled) {
                dayDiv.style.cursor = 'pointer';
                dayDiv.onclick = () => selectDate(displayDate);
            }

            calendarDays.appendChild(dayDiv);
        }
    }

    function selectDate(date) {
        const dateStr = date.toISOString().split('T')[0];
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        if (date < new Date(todayStr)) {
            return;
        }

        if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
            selectedCheckIn = dateStr;
            selectedCheckOut = null;
            updateDateInputs();
        } else if (selectedCheckIn && !selectedCheckOut) {
            const checkInDate = new Date(selectedCheckIn);

            if (date > checkInDate) {
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
        summaryText.innerText = selectedAmenities.map((item) => item.name).join(', ');
    }

    function bindAmenitiesHandlers() {
        document.getElementById('amenitiesToggle')?.addEventListener('click', () => {
            document.getElementById('amenitiesPanel')?.classList.toggle('hidden');
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

        const hasDiscount = pwdDiscount || seniorDiscount;
        const discountAmount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0;
        const discountedSubtotal = subtotal - discountAmount;
        const total = discountedSubtotal + SERVICE_CHARGE;

        document.getElementById('summaryAdults').innerHTML = `Adults: ${adults}`;
        document.getElementById('summaryKids').innerHTML = `Kids (3-12): ${kids}`;
        document.getElementById('summaryInfants').innerHTML = `Infants (0-2): ${infants} (free)`;
        document.getElementById('summaryExtraBeds').innerHTML = `Extra Beds: ${extraBeds}`;

        document.getElementById('costRoomRate').innerHTML = `₱${roomTotal.toLocaleString()}`;
        document.getElementById('costExtraBeds').innerHTML = `₱${extraBedsTotal.toLocaleString()}`;
        document.getElementById('costAmenities').innerHTML = `₱${amenitiesTotal.toLocaleString()}`;
        document.getElementById('costSubtotal').innerHTML = `₱${subtotal.toLocaleString()}`;

        const discountRow = document.getElementById('discountRow');
        const costDiscount = document.getElementById('costDiscount');
        
        if (hasDiscount) {
            discountRow.style.display = 'flex';
            const discountType = pwdDiscount ? 'PWD' : 'Senior';
            document.querySelector('#discountRow span:first-child').innerHTML = `${discountType} Discount (20%)`;
            costDiscount.innerHTML = `-₱${discountAmount.toLocaleString()}`;
        } else {
            discountRow.style.display = 'none';
        }

        document.getElementById('totalAmount').innerHTML = `₱${total.toLocaleString()}`;
    }

    function togglePaymentMethod() {
        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const receiptUpload = document.getElementById('receiptUpload');

        if (selectedMethod === 'gcash') {
            receiptUpload.classList.remove('hidden');
        } else {
            receiptUpload.classList.add('hidden');
        }
    }

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('receiptFile');
    const fileNameSpan = document.getElementById('fileName');

    if (uploadArea) {
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-green-500', 'bg-green-50');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('border-green-500', 'bg-green-50');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-green-500', 'bg-green-50');
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) handleFile(e.target.files[0]);
        });
    }

    function handleFile(file) {
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload PNG, JPG, or PDF file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('File must be less than 5MB');
            return;
        }
        fileNameSpan.innerHTML = `✅ ${file.name}`;
        fileNameSpan.classList.remove('hidden');
    }

    function submitBooking() {
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

        const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (selectedMethod === 'gcash') {
            const receiptInput = document.getElementById('receiptFile');
            if (!receiptInput.files[0]) {
                alert('Please upload your payment receipt');
                return;
            }
        }

        const nights = calculateNights(selectedCheckIn, selectedCheckOut);
        const rate = roomRates[roomType] || 0;
        const roomTotal = rate * nights;
        const extraBedsTotal = extraBeds * EXTRA_BED_PRICE * nights;
        const amenitiesTotal = getAmenitiesTotalPerNight() * nights;
        const subtotal = roomTotal + extraBedsTotal + amenitiesTotal;
        const hasDiscount = pwdDiscount || seniorDiscount;
        const discountAmount = hasDiscount ? Math.round(subtotal * DISCOUNT_RATE) : 0;
        const total = (subtotal - discountAmount) + SERVICE_CHARGE;
        const checkInTime = document.getElementById('checkInTime').value;
        const checkOutTime = document.getElementById('checkOutTime').value;

        const bookingData = {
            fullName: fullName,
            email: email,
            contact: contact,
            address: document.getElementById('address').value,
            roomType: roomCatalog[roomType]?.name || 'Selected Room',
            roomId: roomCatalog[roomType]?.id || null,
            roomRate: rate,
            checkIn: selectedCheckIn,
            checkOut: selectedCheckOut,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            nights: nights,
            adults: adults,
            kids: kids,
            infants: infants,
            extraBeds: extraBeds,
            amenities: selectedAmenities.map((item) => item.name),
            pwdDiscount: pwdDiscount,
            seniorDiscount: seniorDiscount,
            paymentMethod: selectedMethod,
            subtotal: subtotal,
            discountAmount: discountAmount,
            serviceCharge: SERVICE_CHARGE,
            amenitiesTotal: amenitiesTotal,
            totalAmount: total
        };

        console.log('Booking Submitted:', bookingData);
        alert(`Booking Confirmed!\n\nThank you ${fullName}!\nTotal Amount: ₱${total.toLocaleString()}\nWe will contact you at ${contact} for confirmation.`);
    }

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

    document.getElementById('roomTypeSearch')?.addEventListener('input', filterRoomTypes);
    bindAmenitiesHandlers();
    loadRoomsFromBackend();
    syncRoomSummary();
    refreshAvailabilityForMonth();
    updateSummary();
    updateAmenitiesSummary();
    window.updateDateSummary();
</script>
@endsection
