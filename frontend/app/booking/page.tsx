"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant, Inter, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import logo from '../images/logos1.png';

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const cormorantInfant = Cormorant({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

// Month names array
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Booking policy: check-in at 3 PM, check-out at 11 AM next day
const CHECK_IN_HOUR = 15;
const CHECK_OUT_HOUR = 11;

// Room type → 'deluxe' keyword check
const ROOM_A_KEYWORDS = ['room a', 'deluxe'];

export default function BookingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("Standard Room B - ₱2,500");

  // Booking submission state
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Check-in / check-out selection state
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');

  // Child guest state
  const [hasChildren, setHasChildren] = useState(false);
  const [childAgeGroup, setChildAgeGroup] = useState<'under2' | 'over2' | null>(null);

  // PWD / Senior Citizen discount state
  const [hasPwd, setHasPwd] = useState(false);
  const [hasSenior, setHasSenior] = useState(false);

  // Extra beds state (0, 1, or 2)
  const [extraBeds, setExtraBeds] = useState(0);

  // Real availability state
  const [bookedDays, setBookedDays] = useState<number[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  
  // Dynamic calendar state
  const today = new Date();
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState(today.getMonth());
  const [currentDisplayYear, setCurrentDisplayYear] = useState(today.getFullYear());

  // Get current month details
  const currentMonthName = monthNames[currentDisplayMonth];
  const currentYearNum = currentDisplayYear;

  // Calculate days in current month
  const daysInMonth = new Date(currentDisplayYear, currentDisplayMonth + 1, 0).getDate();
  
  // Calculate first day of week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentDisplayYear, currentDisplayMonth, 1).getDay();

  // Get today's date for comparison
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  // Check if a date is in the past
  const isDatePast = (day: number): boolean => {
    const checkDate = new Date(currentDisplayYear, currentDisplayMonth, day);
    const todayStart = new Date(todayYear, todayMonth, todayDate);
    return checkDate < todayStart;
  };

  // Check if a date is available
  const isDateAvailable = (day: number): boolean => {
    if (isDatePast(day)) return false;
    return !bookedDays.includes(day);
  };

  const roomRates: Record<string, number> = {
    "Standard Room B - ₱2,500": 2500,
    "Deluxe Room A - ₱4,500": 4500
  };

  // Get amenities based on room type
  const getAmenitiesForRoom = (room: string): string[] => {
    if (room.includes("Deluxe")) {
      return ["Air Conditioning", "Smart TV", "Bathtub", "2 King Beds", "Mini Sala", "Cabinet", "Premium Shower"];
    } else {
      return ["Air Conditioning", "TV", "2 Single Beds", "Cabinet", "Shower"];
    }
  };

  const MAX_TOTAL_GUESTS = 4;
  const DISCOUNT_RATE = 0.20;
  const EXTRA_BED_PRICE = 700;

  const numberOfNights = (checkInDate && checkOutDate)
    ? Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  const baseRate = roomRates[roomType] ?? 2500;
  const totalRoomCost = baseRate * numberOfNights;
  const extraBedsFee = extraBeds * EXTRA_BED_PRICE * numberOfNights;
  const subtotalBeforeDiscount = totalRoomCost + extraBedsFee;
  const hasDiscount = hasPwd || hasSenior;
  const discountAmount = hasDiscount ? Math.round(subtotalBeforeDiscount * DISCOUNT_RATE) : 0;
  const discountedSubtotal = subtotalBeforeDiscount - discountAmount;
  const taxes = 85.00;
  const total = discountedSubtotal + taxes;
  const amenitiesList = getAmenitiesForRoom(roomType);

  // Total guests: adults + child 3+ (capped at max)
  const totalGuests = Math.min(guests + (hasChildren && childAgeGroup === 'over2' ? 1 : 0), MAX_TOTAL_GUESTS);
  // Max adults allowed when a child 3+ is present
  const maxAdultGuests = hasChildren && childAgeGroup === 'over2' ? MAX_TOTAL_GUESTS - 1 : MAX_TOTAL_GUESTS;

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
    }

    syncSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Fetch real room availability from the database whenever the displayed month,
  // displayed year, or selected room type changes.
  useEffect(() => {
    const fetchAvailability = async () => {
      // Derive the room_id value (11 for Deluxe, 10 for Standard) from the selected room type
      const isDeluxe = roomType.includes('Deluxe') || roomType.includes('Room A');
      const roomId = isDeluxe ? 11 : 10;

      setAvailabilityLoading(true);
      try {
        const res = await fetch(
          `/api/rooms/availability/month?year=${currentDisplayYear}&month=${currentDisplayMonth + 1}&room_id=${roomId}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookedDays(data.unavailableDays || []);
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchAvailability();
  }, [currentDisplayMonth, currentDisplayYear, roomType]);

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
    router.replace('/')
  }

  const getSelectedRoomId = (): number => {
    const isDeluxe = roomType.includes('Deluxe') || roomType.includes('Room A');
    return isDeluxe ? 11 : 10;
  };

  const handleConfirmBooking = async () => {
    if (!checkInDate || !checkOutDate) return;

    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    setBookingError(null);
    setBookingSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const room_id = getSelectedRoomId();

      // Check-in at 3:00 PM on check-in date, check-out at 11:00 AM on check-out date
      const checkIn = new Date(checkInDate);
      checkIn.setHours(CHECK_IN_HOUR, 0, 0, 0);
      const checkOut = new Date(checkOutDate);
      checkOut.setHours(CHECK_OUT_HOUR, 0, 0, 0);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          room_id,
          room_type: ROOM_A_KEYWORDS.some((kw) => roomType.toLowerCase().includes(kw)) ? 'deluxe' : 'standard',
          start_at: checkIn.toISOString(),
          end_at: checkOut.toISOString(),
          guests: totalGuests,
          extra_beds: extraBeds,
          has_pwd: hasPwd,
          has_senior: hasSenior,
          has_child: hasChildren,
          child_age_group: hasChildren ? childAgeGroup : null,
          total_price: total,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || 'Failed to create booking. Please try again.');
      } else {
        setBookingSuccess('Booking confirmed! Admin will contact you at 3:00 PM for confirmation.');
        setCheckInDate(null);
        setCheckOutDate(null);
      }
    } catch (err: any) {
      setBookingError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      router.push('/login')
    }
  }

  const closeMenu = () => setMobileMenuOpen(false);

  const handleDateSelect = (day: number) => {
    if (isDatePast(day)) return;
    const clickedDate = new Date(currentDisplayYear, currentDisplayMonth, day);

    // If no check-in selected, or if a full range is already selected, start fresh
    if (!checkInDate || checkOutDate) {
      if (isDateAvailable(day)) {
        setCheckInDate(clickedDate);
        setCheckOutDate(null);
      }
      return;
    }

    // Check-in is set, check-out is not
    if (clickedDate <= checkInDate) {
      // Clicked on or before check-in: reset to new check-in
      if (isDateAvailable(day)) {
        setCheckInDate(clickedDate);
        setCheckOutDate(null);
      }
    } else {
      // Clicked after check-in: set as check-out
      setCheckOutDate(clickedDate);
    }
  };

  const handlePreviousMonth = () => {
    let newMonth = currentDisplayMonth;
    let newYear = currentDisplayYear;

    if (currentDisplayMonth === 0) {
      newMonth = 11;
      newYear = currentDisplayYear - 1;
    } else {
      newMonth = currentDisplayMonth - 1;
      newYear = currentDisplayYear;
    }

    // Don't allow navigating before the current month
    if (newYear < todayYear || (newYear === todayYear && newMonth < todayMonth)) {
      return;
    }

    setCurrentDisplayMonth(newMonth);
    setCurrentDisplayYear(newYear);
  };

  const handleNextMonth = () => {
    // Prevent going too far into the future (optional - limit to 1 year ahead)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    let newMonth = currentDisplayMonth;
    let newYear = currentDisplayYear;
    
    if (currentDisplayMonth === 11) {
      newMonth = 0;
      newYear = currentDisplayYear + 1;
    } else {
      newMonth = currentDisplayMonth + 1;
      newYear = currentDisplayYear;
    }
    
    // Check if we're within allowed range
    if (new Date(newYear, newMonth, 1) <= maxDate) {
      setCurrentDisplayMonth(newMonth);
      setCurrentDisplayYear(newYear);
    }
  };

  const isDateInRange = (day: number): boolean => {
    if (!checkInDate || !checkOutDate) return false;
    const date = new Date(currentDisplayYear, currentDisplayMonth, day);
    return date > checkInDate && date < checkOutDate;
  };

  type DateButtonStyle = {
    background: string;
    color: string;
    cursor: string;
    boxShadow: string;
    border: string;
    fontWeight?: number;
  };

  const getDateButtonStyle = (day: number, isCheckIn: boolean, isCheckOut: boolean, isValidCheckoutTarget: boolean): DateButtonStyle => {
    const isPast = isDatePast(day);
    const isAvailable = isDateAvailable(day);
    const inRange = isDateInRange(day);
    
    if (isPast) {
      return {
        background: 'rgba(156, 163, 175, 0.1)',
        color: 'rgba(156, 163, 175, 0.5)',
        cursor: 'not-allowed',
        boxShadow: 'none',
        border: 'none'
      };
    }
    
    if (isCheckIn || isCheckOut) {
      return {
        background: '#DCFCE7',
        color: '#16A34A',
        cursor: 'pointer',
        boxShadow: '0px 2px 8px rgba(34, 197, 94, 0.2)',
        border: '1px solid #16A34A',
        fontWeight: 700
      };
    }

    if (inRange) {
      return {
        background: 'rgba(34, 197, 94, 0.1)',
        color: '#16A34A',
        cursor: !isAvailable ? 'not-allowed' : 'pointer',
        boxShadow: 'none',
        border: 'none'
      };
    }
    
    if (!isAvailable && !isValidCheckoutTarget) {
      return {
        background: '#FEF2F2',
        color: '#EF4444',
        cursor: 'not-allowed',
        boxShadow: 'none',
        border: 'none'
      };
    }
    
    // Check if this is today's date
    const isToday = day === todayDate && 
                    currentDisplayMonth === todayMonth && 
                    currentDisplayYear === todayYear;
    
    return {
      background: 'transparent',
      color: '#3D5A4C',
      cursor: 'pointer',
      boxShadow: 'none',
      border: isToday ? '2px solid #22C55E' : 'none',
      fontWeight: isToday ? 700 : 500
    };
  };

  const formatSelectedDate = (date: Date | null): string => {
    if (!date) return 'Not selected';
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  return (
    <div className={`min-h-screen ${inter.className}`} style={{ background: '#FFFAF5' }}>
      {/* Navbar - Same as Homepage */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center shrink-0">
              <Image 
                src={logo} 
                alt="CHTM-RRS Logo"
                width={140}
                height={46}
                className="object-contain h-10 sm:h-12 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/" className="py-2" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px' }}>
                Home
              </Link>
              <Link 
                href={isLoggedIn ? "/booking" : "/login"} 
                onClick={handleBookingClick}
                className="relative py-2" 
                style={{ color: '#3D5A4C', fontSize: '14px', fontWeight: 500 }}
              >
                Booking
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '1px', background: '#FFB5C5' }}></span>
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="py-2"
                  style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="py-2" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px' }}>
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 top-2' : 'top-0'
                  }`}
                />
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] top-2 transition-opacity duration-300 ease-in-out ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 top-2' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors"
              style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px' }}
            >
              Home
            </Link>
            <Link 
              href={isLoggedIn ? "/booking" : "/login"}
              onClick={(e) => {
                closeMenu();
                if (!isLoggedIn) {
                  e.preventDefault();
                  router.push('/login');
                }
              }}
              className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors"
              style={{ color: '#3D5A4C', fontSize: '16px', fontWeight: 500 }}
            >
              Booking
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors text-left"
                style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors"
                style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px' }}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: '16px', color: '#FFB5C5', fontFamily: 'Inter', letterSpacing: '0px', marginBottom: '8px' }}>
            RESERVATION
          </p>
          <h1 
            className={cormorantInfant.className}
            style={{ fontSize: 'clamp(32px, 8vw, 51px)', fontWeight: 400, lineHeight: '1.2', color: '#3D5A4C' }}
          >
            Secure Your Stay
          </h1>
        </div>

        {/* Booking Form Grid */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left Column - Calendar */}
          <div className="flex-1">
            <h2 className={cormorantInfant.className} style={{ fontSize: 'clamp(32px, 6vw, 51px)', fontWeight: 400, lineHeight: '1.2', color: '#3D5A4C', marginBottom: '16px' }}>
              Calendar
            </h2>
            <p style={{ fontSize: '10.2px', fontWeight: 500, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter', marginBottom: '8px' }}>
              Select check-in date, then select check-out date (Check-in: 3:00 PM | Check-out: 11:00 AM)
            </p>
            <p style={{ fontSize: '10.2px', fontWeight: 700, lineHeight: '16px', color: '#EF4444', fontFamily: 'Inter', marginBottom: '8px' }}>
              ⚠ Disclaimer: Reservations not checked in by 9:00 PM are automatically forfeited.
            </p>
            <p style={{ fontSize: '10.2px', fontWeight: 600, lineHeight: '16px', color: '#3D5A4C', fontFamily: 'Inter', marginBottom: '16px' }}>
              Showing availability for: {roomType.split(' - ')[0]}
            </p>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: '#DCFCE7', borderRadius: '4px', border: '1px solid #16A34A' }} />
                <span style={{ fontSize: '11px', color: '#16A34A', fontFamily: 'Inter' }}>Check-in / Check-out</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '4px', border: '1px solid #22C55E' }} />
                <span style={{ fontSize: '11px', color: '#16A34A', fontFamily: 'Inter' }}>In Range</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: '#FEF2F2', borderRadius: '4px', border: '1px solid #EF4444' }} />
                <span style={{ fontSize: '11px', color: '#EF4444', fontFamily: 'Inter' }}>Unavailable</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: 'rgba(156, 163, 175, 0.1)', borderRadius: '4px', border: '1px solid #9CA3AF' }} />
                <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'Inter' }}>Past Date</span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: 'transparent', borderRadius: '4px', border: '2px solid #22C55E' }} />
                <span style={{ fontSize: '11px', color: '#22C55E', fontFamily: 'Inter', fontWeight: 700 }}>Today</span>
              </div>
            </div>
            
            <div className="group" style={{ background: '#FFFAF5', boxShadow: '0px 4px 12px rgba(61, 90, 76, 0.08)', borderRadius: '8px', padding: 'clamp(20px, 5vw, 32.9px)', transition: 'all 0.3s ease', border: '1px solid rgba(61, 90, 76, 0.05)' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <button 
                  className="flex items-center justify-center transition-all duration-200"
                  style={{
                    width: '35.99px', height: '35.99px', borderRadius: '9999px', border: 'none',
                    background: 'transparent',
                    cursor: (currentDisplayMonth === todayMonth && currentDisplayYear === todayYear) ? 'not-allowed' : 'pointer',
                    opacity: (currentDisplayMonth === todayMonth && currentDisplayYear === todayYear) ? 0.3 : 1
                  }}
                  onClick={handlePreviousMonth}
                  disabled={currentDisplayMonth === todayMonth && currentDisplayYear === todayYear}
                >
                  <svg width="20" height="20" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center" style={{ gap: '1px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    {currentMonthName}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    ,
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                    {currentYearNum}
                  </span>
                  {availabilityLoading && (
                    <span style={{ fontSize: '11px', color: 'rgba(61, 90, 76, 0.5)', fontFamily: 'Inter', marginLeft: '8px' }}>
                      Loading…
                    </span>
                  )}
                </div>

                <button 
                  className="hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
                  style={{ width: '35.99px', height: '35.99px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  onClick={handleNextMonth}
                >
                  <svg width="20" height="20" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7" style={{ marginBottom: '16px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div 
                      key={day} 
                      className="text-center flex items-center justify-center"
                      style={{ fontSize: '10.2px', fontWeight: 700, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.4)', fontFamily: 'Inter', height: '32px' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: '0.99px', background: 'rgba(201, 169, 98, 0.2)', marginBottom: '16px' }} />

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-y-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '48px' }} />
                  ))}

                  {/* Days of the month */}
                  {(() => {
                    const isSelectingCheckout = !!checkInDate && !checkOutDate;
                    return Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isCheckIn = checkInDate?.getDate() === day &&
                                      checkInDate?.getMonth() === currentDisplayMonth &&
                                      checkInDate?.getFullYear() === currentDisplayYear;
                    const isCheckOut = checkOutDate?.getDate() === day &&
                                       checkOutDate?.getMonth() === currentDisplayMonth &&
                                       checkOutDate?.getFullYear() === currentDisplayYear;
                    const isPast = isDatePast(day);
                    const isAvailable = isDateAvailable(day);
                    const isToday = day === todayDate && 
                                   currentDisplayMonth === todayMonth && 
                                   currentDisplayYear === todayYear;
                    const thisDateObj = new Date(currentDisplayYear, currentDisplayMonth, day);
                    const isValidCheckoutTarget = isSelectingCheckout && checkInDate !== null && thisDateObj > checkInDate;
                    const buttonStyle = getDateButtonStyle(day, isCheckIn, isCheckOut, isValidCheckoutTarget);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isPast || (!isAvailable && !isValidCheckoutTarget)}
                        className="flex items-center justify-center transition-all duration-200 mx-auto disabled:opacity-100 relative"
                        style={{
                          width: 'clamp(32px, 8vw, 38.71px)',
                          height: '48px',
                          borderRadius: '9999px',
                          fontSize: '11.9px',
                          fontWeight: buttonStyle.fontWeight || 500,
                          lineHeight: '20px',
                          fontFamily: 'Inter',
                          opacity: isPast ? 0.4 : 1,
                          ...buttonStyle
                        }}
                        title={isCheckIn ? 'Check-in' : isCheckOut ? 'Check-out' : undefined}
                      >
                        {day}
                        {isToday && !isCheckIn && !isCheckOut && (
                          <span 
                            style={{
                              position: 'absolute',
                              bottom: '4px',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: '#22C55E'
                            }}
                          />
                        )}
                        {isCheckIn && (
                          <span style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '6px', color: '#16A34A', fontWeight: 700 }}>IN</span>
                        )}
                        {isCheckOut && (
                          <span style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '6px', color: '#16A34A', fontWeight: 700 }}>OUT</span>
                        )}
                      </button>
                    );
                  });
                  })()}
                </div>
              </div>
            </div>

            {/* Selected Date Range Display */}
            <div className="mt-4 space-y-2">
              {checkInDate && (
                <div className="p-3 rounded-lg" style={{ background: '#DCFCE7' }}>
                  <p style={{ fontSize: '12px', color: '#16A34A', fontFamily: 'Inter' }}>
                    ✓ Check-in: {formatSelectedDate(checkInDate)}
                    {!checkOutDate && <span style={{ color: 'rgba(61,90,76,0.6)', marginLeft: '8px' }}>(now select check-out date)</span>}
                  </p>
                </div>
              )}
              {checkOutDate && (
                <div className="p-3 rounded-lg" style={{ background: '#DCFCE7' }}>
                  <p style={{ fontSize: '12px', color: '#16A34A', fontFamily: 'Inter' }}>
                    ✓ Check-out: {formatSelectedDate(checkOutDate)}
                  </p>
                </div>
              )}
              {!checkInDate && (
                <p style={{ fontSize: '11px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter' }}>
                  Click a date to set your check-in date.
                </p>
              )}
            </div>
          </div>

          {/* Middle Column - Form Fields */}
          <div className="flex-1 space-y-8 sm:space-y-10">
            {/* Guests */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Guests
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Maximum of 4 persons per room
              </p>
              <div className="flex items-center justify-center" style={{ gap: '24px', padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: '13.6px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer', boxShadow: '0px 2px 4px rgba(61, 90, 76, 0.05)' }}
                >
                  −
                </button>
                <span style={{ fontSize: '24px', fontWeight: 500, lineHeight: '32px', color: '#3D5A4C', minWidth: '50px', textAlign: 'center', fontFamily: 'Inter' }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(maxAdultGuests, guests + 1))}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: '13.6px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer', boxShadow: '0px 2px 4px rgba(61, 90, 76, 0.05)' }}
                >
                  +
                </button>
              </div>
              {hasChildren && childAgeGroup === 'over2' && (
                <p style={{ fontSize: '10.2px', color: '#FFB5C5', fontFamily: 'Inter', marginTop: '8px', textAlign: 'center' }}>
                  +1 child guest (3+ years) · Total: {totalGuests} persons
                </p>
              )}
            </div>

            {/* Children Guest Section */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Children
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Children 2 years old and below stay for free · Children 3 years old and above count as a guest
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }}>
                <label className="flex items-center gap-3 cursor-pointer" style={{ marginBottom: hasChildren ? '16px' : '0' }}>
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => {
                      setHasChildren(e.target.checked);
                      if (!e.target.checked) setChildAgeGroup(null);
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter' }}>
                    My party includes a child
                  </span>
                </label>
                {hasChildren && (
                  <div className="space-y-3">
                    <p style={{ fontSize: '11px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter', marginBottom: '8px' }}>
                      Select child age group:
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200" style={{ background: childAgeGroup === 'under2' ? 'rgba(34,197,94,0.1)' : 'rgba(61,90,76,0.03)', border: `1px solid ${childAgeGroup === 'under2' ? '#22C55E' : 'rgba(61,90,76,0.1)'}` }}>
                      <input
                        type="radio"
                        name="childAge"
                        value="under2"
                        checked={childAgeGroup === 'under2'}
                        onChange={() => setChildAgeGroup('under2')}
                        style={{ marginTop: '2px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                      />
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                          2 years old and below
                        </span>
                        <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter' }}>
                          ✓ Stays for free · Does not count as a guest
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200" style={{ background: childAgeGroup === 'over2' ? 'rgba(255,181,197,0.2)' : 'rgba(61,90,76,0.03)', border: `1px solid ${childAgeGroup === 'over2' ? '#FFB5C5' : 'rgba(61,90,76,0.1)'}` }}>
                      <input
                        type="radio"
                        name="childAge"
                        value="over2"
                        checked={childAgeGroup === 'over2'}
                        onChange={() => {
                          setChildAgeGroup('over2');
                          // Ensure adult guests don't exceed 3 (to leave room for the child)
                          if (guests > MAX_TOTAL_GUESTS - 1) setGuests(MAX_TOTAL_GUESTS - 1);
                        }}
                        style={{ marginTop: '2px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                      />
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                          3 years old and above
                        </span>
                        <span style={{ fontSize: '10px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                          Counts as an additional guest
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* PWD / Senior Citizen Discount */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Discount Eligibility
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                20% discount for PWD or Senior Citizen · Required documents verified at check-in
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }} className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200" style={{ background: hasPwd ? 'rgba(34,197,94,0.1)' : 'transparent', border: `1px solid ${hasPwd ? '#22C55E' : 'transparent'}` }}>
                  <input
                    type="checkbox"
                    checked={hasPwd}
                    onChange={(e) => {
                      setHasPwd(e.target.checked);
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                      Person with Disability (PWD)
                    </span>
                    {hasPwd && (
                      <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter' }}>
                        ✓ 20% discount applied
                      </span>
                    )}
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200" style={{ background: hasSenior ? 'rgba(34,197,94,0.1)' : 'transparent', border: `1px solid ${hasSenior ? '#22C55E' : 'transparent'}` }}>
                  <input
                    type="checkbox"
                    checked={hasSenior}
                    onChange={(e) => {
                      setHasSenior(e.target.checked);
                    }}
                    style={{ width: '16px', height: '16px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                      Senior Citizen (60 years old and above)
                    </span>
                    {hasSenior && (
                      <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter' }}>
                        ✓ 20% discount applied
                      </span>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Room Type
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Standard Room B: ₱2,500 | Deluxe Room A: ₱4,500
              </p>
              <div className="flex justify-between items-center hover:border-opacity-80 hover:bg-gray-50 transition-all duration-200" style={{ padding: '16px', borderBottom: '2px solid rgba(61, 90, 76, 0.15)', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px 8px 0 0' }}>
                <select
                  value={roomType}
                  onChange={(e) => { setRoomType(e.target.value); setCheckInDate(null); setCheckOutDate(null); }}
                  className="transition-colors duration-200"
                  style={{
                    width: '100%',
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#3D5A4C',
                    fontFamily: 'Inter',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none'
                  }}
                >
                  <option value="Standard Room B - ₱2,500">Standard Room B - ₱2,500</option>
                  <option value="Deluxe Room A - ₱4,500">Deluxe Room A - ₱4,500</option>
                </select>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A4C" strokeWidth="1" className="transition-transform duration-200">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Included Amenities - With Availability Indicators */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Included Amenities
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                All amenities below are available for your selected room
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }}>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        color: '#16A34A',
                        background: 'rgba(34, 197, 94, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontFamily: 'Inter',
                        border: '1px solid rgba(34, 197, 94, 0.3)'
                      }}
                    >
                      ✓ {amenity} · Available
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Extra Beds Request */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Additional Request
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Extra beds available upon request · ₱700 per extra bed
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }} className="space-y-3">
                {[
                  { value: 0, label: 'No extra bed', sublabel: null },
                  { value: 1, label: '1 Extra Bed', sublabel: '+₱700' },
                  { value: 2, label: '2 Extra Beds', sublabel: '+₱1,400' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200"
                    style={{
                      background: extraBeds === option.value ? 'rgba(61,90,76,0.08)' : 'transparent',
                      border: `1px solid ${extraBeds === option.value ? 'rgba(61,90,76,0.3)' : 'transparent'}`
                    }}
                  >
                    <input
                      type="radio"
                      name="extraBeds"
                      value={option.value}
                      checked={extraBeds === option.value}
                      onChange={() => setExtraBeds(option.value)}
                      style={{ accentColor: '#3D5A4C', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter' }}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span style={{ fontSize: '11px', color: '#FFB5C5', fontFamily: 'Inter', marginLeft: 'auto' }}>
                        {option.sublabel}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Date and Time
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Check-in: 3:00 PM | Check-out: 11:00 AM
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3" style={{ padding: '12px 16px', background: 'rgba(255, 181, 197, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 181, 197, 0.3)' }}>
                  <svg width="20" height="20" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span style={{ fontSize: '10px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter', display: 'block' }}>Check-in (3:00 PM)</span>
                    <span style={{ fontSize: '12px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                      {checkInDate ? formatSelectedDate(checkInDate) : 'Not selected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3" style={{ padding: '12px 16px', background: 'rgba(255, 181, 197, 0.15)', borderRadius: '8px', border: '1px solid rgba(255, 181, 197, 0.3)' }}>
                  <svg width="20" height="20" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span style={{ fontSize: '10px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter', display: 'block' }}>Check-out (11:00 AM)</span>
                    <span style={{ fontSize: '12px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                      {checkOutDate ? formatSelectedDate(checkOutDate) : 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode of Payment */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Mode of Payment
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Select your preferred payment method
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }} className="space-y-3">
                {[
                  { value: 'cash', label: 'Cash', sublabel: 'Pay upon check-in' },
                  { value: 'gcash', label: 'GCash', sublabel: 'Mobile wallet payment' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all duration-200"
                    style={{
                      background: paymentMethod === option.value ? 'rgba(61,90,76,0.08)' : 'transparent',
                      border: `1px solid ${paymentMethod === option.value ? 'rgba(61,90,76,0.3)' : 'transparent'}`
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value as 'cash' | 'gcash')}
                      style={{ accentColor: '#3D5A4C', cursor: 'pointer' }}
                    />
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                        {option.label}
                      </span>
                      <span style={{ fontSize: '10px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter' }}>
                        {option.sublabel}
                      </span>
                    </div>
                    {paymentMethod === option.value && (
                      <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter', marginLeft: 'auto' }}>✓ Selected</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Your Stay Summary */}
          <div className="flex-1" style={{ background: '#3D5A4C', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '8px', boxShadow: '0px 8px 24px rgba(61, 90, 76, 0.2)' }}>
            <h2 className={cormorantInfant.className} style={{ fontSize: '24px', fontWeight: 400, lineHeight: '32px', color: '#FFFAF5', marginBottom: 'clamp(32px, 8vw, 64px)' }}>
              Your Stay
            </h2>

            {/* Summary Details */}
            <div className="space-y-0" style={{ marginBottom: '48px' }}>
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Check-in</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {formatSelectedDate(checkInDate)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Check-out</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {formatSelectedDate(checkOutDate)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Guests</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {totalGuests}{hasChildren && childAgeGroup === 'under2' ? ' + 1 infant (free)' : ''}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Room</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{roomType}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              {(hasPwd || hasSenior) && (
                <>
                  <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                    <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Discount</span>
                    <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>
                      {hasPwd && hasSenior ? 'PWD & Senior Citizen' : hasPwd ? 'PWD' : 'Senior Citizen'} (20%)
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
                </>
              )}

              {extraBeds > 0 && (
                <>
                  <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                    <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Extra Beds</span>
                    <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                      {extraBeds} bed{extraBeds > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
                </>
              )}
              
              <div style={{ paddingBottom: '0px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter', display: 'block', marginBottom: '8px' }}>Included Amenities</span>
                <div className="flex flex-wrap gap-1">
                  {amenitiesList.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} style={{ fontSize: '10px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                      {amenity}{idx < 2 && amenitiesList.length > 3 ? ',' : ''}
                    </span>
                  ))}
                  {amenitiesList.length > 3 && (
                    <span style={{ fontSize: '10px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                      +{amenitiesList.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginTop: '16px' }} />
            </div>

            {/* Pricing */}
            <div className="space-y-3" style={{ marginBottom: '32px' }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  Room Rate ({numberOfNights} night{numberOfNights !== 1 ? 's' : ''})
                </span>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{totalRoomCost.toFixed(2)}</span>
              </div>
              {numberOfNights > 1 && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '10.5px', fontWeight: 400, lineHeight: '18px', color: 'rgba(255,250,245,0.6)', fontFamily: 'Inter' }}>
                    ₱{baseRate.toFixed(2)} × {numberOfNights} nights
                  </span>
                </div>
              )}
              {extraBeds > 0 && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                    Extra Bed{extraBeds > 1 ? 's' : ''} (×{extraBeds}{numberOfNights > 1 ? ` × ${numberOfNights} nights` : ''})
                  </span>
                  <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{extraBedsFee.toFixed(2)}</span>
                </div>
              )}
              {hasDiscount && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>
                    {hasPwd && hasSenior ? 'PWD & Senior Citizen' : hasPwd ? 'PWD' : 'Senior Citizen'} Discount (20%)
                  </span>
                  <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>−₱{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Service Charges*</span>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{taxes.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Payment Method</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFB5C5', fontFamily: 'Inter', textTransform: 'capitalize' }}>{paymentMethod}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              <div className="flex justify-between items-center" style={{ paddingTop: '8px' }}>
                <span className={cormorantInfant.className} style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5' }}>Total</span>
                <span className={cormorantInfant.className} style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5' }}>₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Booking feedback messages */}
            {bookingError && (
              <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'rgba(239,68,68,0.15)', borderRadius: '4px', border: '1px solid rgba(239,68,68,0.4)' }}>
                <p style={{ fontSize: '11px', color: '#FCA5A5', fontFamily: 'Inter' }}>{bookingError}</p>
              </div>
            )}
            {bookingSuccess && (
              <div style={{ marginBottom: '12px', padding: '10px 14px', background: 'rgba(34,197,94,0.15)', borderRadius: '4px', border: '1px solid rgba(34,197,94,0.4)' }}>
                <p style={{ fontSize: '11px', color: '#86EFAC', fontFamily: 'Inter' }}>{bookingSuccess}</p>
              </div>
            )}

            {/* Confirm Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                className="group/btn hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!checkInDate || !checkOutDate || bookingLoading}
                onClick={handleConfirmBooking}
                style={{
                  width: '100%',
                  maxWidth: '257px',
                  height: '48px',
                  background: (checkInDate && checkOutDate) ? '#FFFAF5' : '#9CA3AF',
                  boxShadow: (checkInDate && checkOutDate) ? '0px 4px 12px rgba(255, 181, 197, 0.3)' : 'none',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '11.9px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: '#3D5A4C',
                  fontFamily: 'Inter',
                  cursor: (checkInDate && checkOutDate) && !bookingLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                  if (checkInDate && checkOutDate && !bookingLoading) {
                    e.currentTarget.style.background = '#FFB5C5';
                  }
                }}
                onMouseLeave={(e) => {
                  if (checkInDate && checkOutDate && !bookingLoading) {
                    e.currentTarget.style.background = '#FFFAF5';
                  }
                }}
              >
                {bookingLoading ? 'Processing...' : (checkInDate && checkOutDate) ? 'Confirm Booking' : !checkInDate ? 'Select Check-in Date' : 'Select Check-out Date'}
              </button>
            </div>

            {/* Policies and Information */}
            <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '19px', color: '#FFFAF5', textAlign: 'left', fontFamily: 'Inter' }}>
              - Rates include all listed amenities.<br />
              - Extra mattress charge: ₱700.<br />
              - Maximum of 4 persons per room.<br />
              - PWD discount: 20%.<br />
              - Children 2 years old and below stay free.<br />
              - Children 3 years old and above are counted as additional guests.<br />
              - Additional guests are subject to room capacity and corresponding charges.<br />
              - Extra bed requests are subject to availability.<br />
              - Early check-in is subject to room availability.<br />
              - Late check-in is accepted until 9:00 PM; arrivals beyond this time are considered no show.<br />
              - Admin will contact guests at 3:00 PM for booking confirmation.<br />
              - Cancellation is free up to 48 hours before check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
