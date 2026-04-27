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

// Room IDs in the database: 11 = Deluxe, 10 = Standard
const DELUXE_ROOM_ID = 11;
const STANDARD_ROOM_ID = 10;

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
  const [discountOpen, setDiscountOpen] = useState(false);

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
      const roomId = isDeluxe ? DELUXE_ROOM_ID : STANDARD_ROOM_ID;

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
    return isDeluxe ? DELUXE_ROOM_ID : STANDARD_ROOM_ID;
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
    <div className={`min-h-screen ${inter.className}`} style={{ background: 'linear-gradient(135deg, #FFFAF5 0%, #FFF5F5 50%, #FFFAF5 100%)' }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo Section */}
            <Link href="/" className="flex items-center shrink-0 group">
              <Image 
                src={logo} 
                alt="CHTM-RRS Logo"
                width={140}
                height={46}
                className="object-contain h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link href="/" className="py-2 transition-colors duration-200 hover:text-[#FFB5C5]" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px', fontFamily: 'Inter' }}>
                Home
              </Link>
              <Link 
                href={isLoggedIn ? "/booking" : "/login"} 
                onClick={handleBookingClick}
                className="relative py-2 transition-colors duration-200" 
                style={{ color: '#3D5A4C', fontSize: '14px', fontWeight: 500, fontFamily: 'Inter' }}
              >
                Booking
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '2px', background: 'linear-gradient(90deg, #FFB5C5, #C9A962)', borderRadius: '2px' }}></span>
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="py-2 transition-colors duration-200 hover:text-[#FFB5C5]"
                  style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px', fontFamily: 'Inter', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" className="py-2 transition-colors duration-200 hover:text-[#FFB5C5]" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px', fontFamily: 'Inter' }}>
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none hover:bg-gray-50 transition-colors duration-200"
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
          className={`md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link 
              href="/" 
              onClick={closeMenu}
              className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px', fontFamily: 'Inter' }}
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
              className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
              style={{ color: '#3D5A4C', fontSize: '16px', fontWeight: 500, fontFamily: 'Inter' }}
            >
              Booking
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200 text-left"
                style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px', fontFamily: 'Inter', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                onClick={closeMenu}
                className="py-3 px-2 rounded-md hover:bg-gray-50 transition-colors duration-200"
                style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px', fontFamily: 'Inter' }}
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
          <div className="inline-block mb-4">
            <span style={{ 
              fontSize: '13px', 
              fontWeight: 700, 
              lineHeight: '16px', 
              color: '#FFB5C5', 
              fontFamily: 'Inter', 
              letterSpacing: '3px',
              background: 'rgba(255, 181, 197, 0.1)',
              padding: '8px 24px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 181, 197, 0.3)'
            }}>
              RESERVATION
            </span>
          </div>
          <h1 
            className={`${cormorantInfant.className} relative`}
            style={{ 
              fontSize: 'clamp(36px, 8vw, 56px)', 
              fontWeight: 400, 
              lineHeight: '1.2', 
              color: '#3D5A4C',
              textShadow: '0px 2px 4px rgba(61, 90, 76, 0.05)'
            }}
          >
            Secure Your Stay
            <div style={{
              width: '80px',
              height: '2px',
              background: 'linear-gradient(90deg, #FFB5C5, #C9A962)',
              margin: '16px auto 0',
              borderRadius: '2px'
            }} />
          </h1>
        </div>

        {/* Booking Form Grid */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left Column - Calendar */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className={cormorantInfant.className} style={{ fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 400, lineHeight: '1.2', color: '#3D5A4C', marginBottom: '8px' }}>
                Calendar
              </h2>
              <div style={{ width: '60px', height: '2px', background: 'linear-gradient(90deg, #FFB5C5, #C9A962)', borderRadius: '2px', marginBottom: '16px' }} />
            </div>
            
            <p style={{ fontSize: '10.2px', fontWeight: 500, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter', marginBottom: '8px' }}>
              Select check-in date, then select check-out date (Check-in: 3:00 PM | Check-out: 11:00 AM)
            </p>
            <p style={{ fontSize: '10.2px', fontWeight: 700, lineHeight: '16px', color: '#EF4444', fontFamily: 'Inter', marginBottom: '8px' }}>
              ⚠ Disclaimer: Reservations not checked in by 9:00 PM are automatically forfeited.
            </p>
            <div className="inline-block mb-4" style={{
              background: 'rgba(255, 181, 197, 0.1)',
              border: '1px solid rgba(255, 181, 197, 0.3)',
              borderRadius: '20px',
              padding: '4px 16px'
            }}>
              <p style={{ fontSize: '10.2px', fontWeight: 600, lineHeight: '16px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                Showing availability for: {roomType.split(' - ')[0]}
              </p>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 p-4" style={{ background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px', border: '1px solid rgba(61, 90, 76, 0.05)' }}>
              <div className="flex items-center gap-2">
                <div style={{ width: '16px', height: '16px', background: '#DCFCE7', borderRadius: '4px', border: '1px solid #16A34A' }} />
                <span style={{ fontSize: '11px', color: '#16A34A', fontFamily: 'Inter', fontWeight: 600 }}>Check-in/out</span>
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
            
            <div className="group" style={{ background: '#FFFFFF', boxShadow: '0px 8px 32px rgba(61, 90, 76, 0.08)', borderRadius: '12px', padding: 'clamp(20px, 5vw, 32.9px)', transition: 'all 0.3s ease', border: '1px solid rgba(61, 90, 76, 0.08)' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <button 
                  className="flex items-center justify-center transition-all duration-200 hover:bg-gray-50"
                  style={{
                    width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.1)',
                    background: 'white',
                    cursor: (currentDisplayMonth === todayMonth && currentDisplayYear === todayYear) ? 'not-allowed' : 'pointer',
                    opacity: (currentDisplayMonth === todayMonth && currentDisplayYear === todayYear) ? 0.3 : 1
                  }}
                  onClick={handlePreviousMonth}
                  disabled={currentDisplayMonth === todayMonth && currentDisplayYear === todayYear}
                >
                  <svg width="18" height="18" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '18px', fontWeight: 600, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    {currentMonthName}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                    {currentYearNum}
                  </span>
                  {availabilityLoading && (
                    <span style={{ fontSize: '11px', color: 'rgba(61, 90, 76, 0.5)', fontFamily: 'Inter', marginLeft: '8px' }}>
                      Loading…
                    </span>
                  )}
                </div>

                <button 
                  className="flex items-center justify-center transition-all duration-200 hover:bg-gray-50"
                  style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.1)', background: 'white', cursor: 'pointer' }}
                  onClick={handleNextMonth}
                >
                  <svg width="18" height="18" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1" style={{ marginBottom: '12px' }}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div 
                      key={day} 
                      className="text-center flex items-center justify-center"
                      style={{ fontSize: '11px', fontWeight: 700, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.5)', fontFamily: 'Inter', height: '32px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '6px' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '48px' }} />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isCheckIn = checkInDate?.getDate() === day &&
                                      checkInDate?.getMonth() === currentDisplayMonth &&
                                      checkInDate?.getFullYear() === currentDisplayYear;
                    const isCheckOut = checkOutDate?.getDate() === day &&
                                       checkOutDate?.getMonth() === currentDisplayMonth &&
                                       checkOutDate?.getFullYear() === currentDisplayYear;
                    const isPast = isDatePast(day);
                    const isAvailable = isDateAvailable(day);
                    const isSelectingCheckout = !!checkInDate && !checkOutDate;
                    const thisDateObj = new Date(currentDisplayYear, currentDisplayMonth, day);
                    const isValidCheckoutTarget = isSelectingCheckout && checkInDate !== null && thisDateObj > checkInDate;
                    const buttonStyle = getDateButtonStyle(day, isCheckIn, isCheckOut, isValidCheckoutTarget);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isPast || (!isAvailable && !isValidCheckoutTarget)}
                        className="flex items-center justify-center transition-all duration-200 mx-auto disabled:opacity-100 relative hover:scale-110"
                        style={{
                          width: '100%',
                          height: '44px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: buttonStyle.fontWeight || 500,
                          lineHeight: '20px',
                          fontFamily: 'Inter',
                          opacity: isPast ? 0.4 : 1,
                          ...buttonStyle
                        }}
                        title={isCheckIn ? 'Check-in' : isCheckOut ? 'Check-out' : undefined}
                      >
                        {day}
                        {isCheckIn && (
                          <span style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '8px', color: '#16A34A', fontWeight: 700, fontFamily: 'Inter' }}>IN</span>
                        )}
                        {isCheckOut && (
                          <span style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '8px', color: '#16A34A', fontWeight: 700, fontFamily: 'Inter' }}>OUT</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Date Range Display */}
            <div className="mt-6 space-y-3">
              {checkInDate && (
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.8) 0%, rgba(220, 252, 231, 0.4) 100%)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <p style={{ fontSize: '13px', color: '#16A34A', fontFamily: 'Inter', fontWeight: 600 }}>
                    ✓ Check-in: {formatSelectedDate(checkInDate)}
                    {!checkOutDate && <span style={{ color: 'rgba(61,90,76,0.6)', marginLeft: '8px', fontWeight: 400 }}>(now select check-out date)</span>}
                  </p>
                </div>
              )}
              {checkOutDate && (
                <div className="p-4 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(220, 252, 231, 0.8) 0%, rgba(220, 252, 231, 0.4) 100%)', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                  <p style={{ fontSize: '13px', color: '#16A34A', fontFamily: 'Inter', fontWeight: 600 }}>
                    ✓ Check-out: {formatSelectedDate(checkOutDate)}
                  </p>
                </div>
              )}
              {!checkInDate && (
                <div className="p-4 rounded-lg" style={{ background: 'rgba(61, 90, 76, 0.02)', border: '1px dashed rgba(61, 90, 76, 0.2)' }}>
                  <p style={{ fontSize: '12px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter', textAlign: 'center' }}>
                    Click a date to set your check-in date
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Form Fields */}
          <div className="flex-1 space-y-8 sm:space-y-10">
            {/* Guests */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Guests
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Maximum of 4 persons per room
              </p>
              <div className="flex items-center justify-center" style={{ gap: '24px', padding: '20px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.08)' }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="hover:shadow-lg flex items-center justify-center transition-all duration-200"
                  style={{ width: '44px', height: '44px', borderRadius: '12px', fontSize: '18px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFFFF', border: '2px solid rgba(61, 90, 76, 0.15)', cursor: 'pointer', boxShadow: '0px 2px 8px rgba(61, 90, 76, 0.08)' }}
                >
                  −
                </button>
                <span style={{ fontSize: '28px', fontWeight: 600, lineHeight: '32px', color: '#3D5A4C', minWidth: '60px', textAlign: 'center', fontFamily: 'Inter' }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(Math.min(maxAdultGuests, guests + 1))}
                  className="hover:shadow-lg flex items-center justify-center transition-all duration-200"
                  style={{ width: '44px', height: '44px', borderRadius: '12px', fontSize: '18px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFFFF', border: '2px solid rgba(61, 90, 76, 0.15)', cursor: 'pointer', boxShadow: '0px 2px 8px rgba(61, 90, 76, 0.08)' }}
                >
                  +
                </button>
              </div>
              {hasChildren && childAgeGroup === 'over2' && (
                <p style={{ fontSize: '10.2px', color: '#FFB5C5', fontFamily: 'Inter', marginTop: '12px', textAlign: 'center', fontWeight: 600, background: 'rgba(255, 181, 197, 0.1)', padding: '8px', borderRadius: '8px' }}>
                  +1 child guest (3+ years) · Total: {totalGuests} persons
                </p>
              )}
            </div>

            {/* Children Guest Section */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Children
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Children 2 years old and below stay for free · Children 3 years old and above count as a guest
              </p>
              <div style={{ padding: '20px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.08)' }}>
                <label className="flex items-center gap-3 cursor-pointer" style={{ marginBottom: hasChildren ? '20px' : '0' }}>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="checkbox"
                      checked={hasChildren}
                      onChange={(e) => {
                        setHasChildren(e.target.checked);
                        if (!e.target.checked) setChildAgeGroup(null);
                      }}
                      style={{ width: '18px', height: '18px', accentColor: '#3D5A4C', cursor: 'pointer' }}
                    />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 500, color: '#3D5A4C', fontFamily: 'Inter' }}>
                    My party includes a child
                  </span>
                </label>
                {hasChildren && (
                  <div className="space-y-3">
                    <p style={{ fontSize: '11px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter', marginBottom: '8px', fontWeight: 500 }}>
                      Select child age group:
                    </p>
                    <label className="flex items-start gap-4 cursor-pointer p-4 rounded-lg transition-all duration-200" style={{ background: childAgeGroup === 'under2' ? 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.06) 100%)' : 'rgba(61,90,76,0.03)', border: `2px solid ${childAgeGroup === 'under2' ? '#22C55E' : 'rgba(61,90,76,0.1)'}` }}>
                      <input
                        type="radio"
                        name="childAge"
                        value="under2"
                        checked={childAgeGroup === 'under2'}
                        onChange={() => setChildAgeGroup('under2')}
                        style={{ marginTop: '3px', accentColor: '#22C55E', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: childAgeGroup === 'under2' ? '#16A34A' : '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                          2 years old and below
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#22C55E', fontFamily: 'Inter', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                          ✓ Stays for free · Does not count as a guest
                        </span>
                      </div>
                    </label>
                    <label className="flex items-start gap-4 cursor-pointer p-4 rounded-lg transition-all duration-200" style={{ background: childAgeGroup === 'over2' ? 'linear-gradient(135deg, rgba(255,181,197,0.15) 0%, rgba(255,181,197,0.08) 100%)' : 'rgba(61,90,76,0.03)', border: `2px solid ${childAgeGroup === 'over2' ? '#FFB5C5' : 'rgba(61,90,76,0.1)'}` }}>
                      <input
                        type="radio"
                        name="childAge"
                        value="over2"
                        checked={childAgeGroup === 'over2'}
                        onChange={() => {
                          setChildAgeGroup('over2');
                          if (guests > MAX_TOTAL_GUESTS - 1) setGuests(MAX_TOTAL_GUESTS - 1);
                        }}
                        style={{ marginTop: '3px', accentColor: '#FFB5C5', cursor: 'pointer', width: '16px', height: '16px' }}
                      />
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: childAgeGroup === 'over2' ? '#FFB5C5' : '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                          3 years old and above
                        </span>
                        <span style={{ fontSize: '10.5px', color: '#FFB5C5', fontFamily: 'Inter', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                          Counts as an additional guest
                        </span>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* PWD / Senior Citizen Discount - ENHANCED DROPDOWN */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <button
                onClick={() => setDiscountOpen(!discountOpen)}
                className="w-full flex items-center justify-between group mb-2"
                style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0',
                }}
              >
                <div className="flex items-center gap-3">
                  <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span style={{ 
                    fontSize: '15px', 
                    fontWeight: 600, 
                    lineHeight: '20px', 
                    color: '#3D5A4C', 
                    fontFamily: 'Inter', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    transition: 'color 0.2s ease'
                  }}>
                    Discount Eligibility
                  </span>
                  {hasDiscount && (
                    <span style={{ 
                      fontSize: '9px', 
                      fontWeight: 700, 
                      color: '#FFFFFF', 
                      background: hasPwd ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' : 'linear-gradient(135deg, #3D5A4C 0%, #2D4A3C 100%)',
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontFamily: 'Inter',
                      letterSpacing: '0.5px',
                      boxShadow: hasPwd ? '0px 2px 8px rgba(34, 197, 94, 0.3)' : '0px 2px 8px rgba(61, 90, 76, 0.3)'
                    }}>
                      {hasPwd ? 'PWD' : 'SENIOR'} ACTIVE
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!discountOpen && hasDiscount && (
                    <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter', fontWeight: 600 }}>
                      20% OFF
                    </span>
                  )}
                  <svg 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="#3D5A4C" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2}
                    className={`transition-transform duration-300 ${discountOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {/* Collapsible content */}
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  discountOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                }`}
              >
                <div style={{ 
                  padding: '4px', 
                  background: 'rgba(61, 90, 76, 0.02)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(61, 90, 76, 0.08)'
                }}>
                  <p style={{ 
                    fontSize: '10.5px', 
                    fontWeight: 500, 
                    lineHeight: '16px', 
                    color: 'rgba(61, 90, 76, 0.7)', 
                    marginBottom: '16px', 
                    fontFamily: 'Inter',
                    padding: '8px 12px',
                    background: 'rgba(255, 181, 197, 0.08)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 181, 197, 0.15)'
                  }}>
                    💡 20% discount available · Valid ID required at check-in · Select only one option below
                  </p>
                  <div className="space-y-3 p-2">
                    {/* PWD Option */}
                    <label 
                      className="flex items-start gap-4 cursor-pointer p-5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                      style={{ 
                        background: hasPwd ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%)' : 'rgba(61, 90, 76, 0.03)', 
                        border: hasPwd ? '2px solid #22C55E' : '2px solid rgba(61, 90, 76, 0.08)',
                        boxShadow: hasPwd ? '0px 4px 16px rgba(34, 197, 94, 0.15)' : 'none',
                        transform: hasPwd ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <input
                        type="radio"
                        name="discountEligibility"
                        value="pwd"
                        checked={hasPwd}
                        onChange={() => {
                          setHasPwd(true);
                          setHasSenior(false);
                        }}
                        style={{ 
                          marginTop: '4px', 
                          accentColor: '#22C55E', 
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px'
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: hasPwd ? '#16A34A' : '#3D5A4C', 
                            fontFamily: 'Inter', 
                            display: 'block',
                            transition: 'color 0.2s ease'
                          }}>
                            Person with Disability (PWD)
                          </span>
                          {hasPwd && (
                            <div style={{
                              background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0px 4px 12px rgba(34, 197, 94, 0.3)'
                            }}>
                              <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span style={{ 
                          fontSize: '10.5px', 
                          color: hasPwd ? '#22C55E' : 'rgba(61, 90, 76, 0.5)', 
                          fontFamily: 'Inter',
                          display: 'block',
                          transition: 'color 0.2s ease',
                          fontWeight: 500
                        }}>
                          {hasPwd ? '✓ 20% discount applied to your booking' : 'PWD ID required at check-in'}
                        </span>
                      </div>
                      {hasPwd && (
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(135deg, transparent 50%, rgba(34, 197, 94, 0.08) 50%)',
                          borderRadius: '0 0 0 50px'
                        }} />
                      )}
                    </label>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(61, 90, 76, 0.06)' }} />
                      <span style={{ fontSize: '9px', color: 'rgba(61, 90, 76, 0.3)', fontFamily: 'Inter', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
                      <div style={{ flex: 1, height: '1px', background: 'rgba(61, 90, 76, 0.06)' }} />
                    </div>

                    {/* Senior Citizen Option */}
                    <label 
                      className="flex items-start gap-4 cursor-pointer p-5 rounded-xl transition-all duration-300 relative overflow-hidden group"
                      style={{ 
                        background: hasSenior ? 'linear-gradient(135deg, rgba(61, 90, 76, 0.15) 0%, rgba(61, 90, 76, 0.08) 100%)' : 'rgba(61, 90, 76, 0.03)', 
                        border: hasSenior ? '2px solid #3D5A4C' : '2px solid rgba(61, 90, 76, 0.08)',
                        boxShadow: hasSenior ? '0px 4px 16px rgba(61, 90, 76, 0.2)' : 'none',
                        transform: hasSenior ? 'scale(1.02)' : 'scale(1)'
                      }}
                    >
                      <input
                        type="radio"
                        name="discountEligibility"
                        value="senior"
                        checked={hasSenior}
                        onChange={() => {
                          setHasSenior(true);
                          setHasPwd(false);
                        }}
                        style={{ 
                          marginTop: '4px', 
                          accentColor: '#3D5A4C', 
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px'
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ 
                            fontSize: '14px', 
                            fontWeight: 600, 
                            color: hasSenior ? '#3D5A4C' : '#3D5A4C', 
                            fontFamily: 'Inter', 
                            display: 'block',
                            transition: 'color 0.2s ease'
                          }}>
                            Senior Citizen (60+)
                          </span>
                          {hasSenior && (
                            <div style={{
                              background: 'linear-gradient(135deg, #3D5A4C 0%, #2D4A3C 100%)',
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0px 4px 12px rgba(61, 90, 76, 0.3)'
                            }}>
                              <svg width="16" height="16" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span style={{ 
                          fontSize: '10.5px', 
                          color: hasSenior ? '#3D5A4C' : 'rgba(61, 90, 76, 0.5)', 
                          fontFamily: 'Inter',
                          display: 'block',
                          transition: 'color 0.2s ease',
                          fontWeight: 500
                        }}>
                          {hasSenior ? '✓ 20% discount applied to your booking' : 'Valid Senior ID required'}
                        </span>
                      </div>
                      {hasSenior && (
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(135deg, transparent 50%, rgba(61, 90, 76, 0.08) 50%)',
                          borderRadius: '0 0 0 50px'
                        }} />
                      )}
                    </label>

                    {/* Clear Selection Button */}
                    {hasDiscount && (
                      <button
                        onClick={() => {
                          setHasPwd(false);
                          setHasSenior(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 mt-2"
                        style={{
                          background: 'rgba(239, 68, 68, 0.06)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#EF4444',
                          fontSize: '11px',
                          fontWeight: 600,
                          fontFamily: 'Inter',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                          e.currentTarget.style.transform = 'scale(1.02)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Remove Discount Selection
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Room Type
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Standard Room B: ₱2,500 | Deluxe Room A: ₱4,500
              </p>
              <div className="flex justify-between items-center transition-all duration-200" style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '2px solid rgba(61, 90, 76, 0.1)' }}>
                <select
                  value={roomType}
                  onChange={(e) => { setRoomType(e.target.value); setCheckInDate(null); setCheckOutDate(null); }}
                  className="transition-colors duration-200"
                  style={{
                    width: '100%',
                    fontSize: 'clamp(14px, 3vw, 16px)',
                    fontWeight: 500,
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
                  <option value="Standard Room B - ₱2,500">Standard Room B - ₱2,500/night</option>
                  <option value="Deluxe Room A - ₱4,500">Deluxe Room A - ₱4,500/night</option>
                </select>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A4C" strokeWidth="1.5" className="transition-transform duration-200">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Included Amenities */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Included Amenities
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                All amenities below are available for your selected room
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
                <div className="flex flex-wrap gap-2">
                  {amenitiesList.map((amenity, idx) => (
                    <span 
                      key={idx}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#16A34A',
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
                        padding: '8px 16px',
                        borderRadius: '24px',
                        fontFamily: 'Inter',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Extra Beds Request */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Additional Request
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Extra beds available upon request · ₱700 per extra bed
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.06)' }} className="space-y-3">
                {[
                  { value: 0, label: 'No extra bed', sublabel: null },
                  { value: 1, label: '1 Extra Bed', sublabel: '+₱700' },
                  { value: 2, label: '2 Extra Beds', sublabel: '+₱1,400' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer p-4 rounded-lg transition-all duration-200"
                    style={{
                      background: extraBeds === option.value ? 'linear-gradient(135deg, rgba(61,90,76,0.1) 0%, rgba(61,90,76,0.05) 100%)' : 'transparent',
                      border: `2px solid ${extraBeds === option.value ? 'rgba(61,90,76,0.3)' : 'rgba(61,90,76,0.06)'}`
                    }}
                  >
                    <input
                      type="radio"
                      name="extraBeds"
                      value={option.value}
                      checked={extraBeds === option.value}
                      onChange={() => setExtraBeds(option.value)}
                      style={{ accentColor: '#3D5A4C', cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D5A4C', fontFamily: 'Inter' }}>
                      {option.label}
                    </span>
                    {option.sublabel && (
                      <span style={{ fontSize: '12px', color: '#FFB5C5', fontFamily: 'Inter', marginLeft: 'auto', fontWeight: 600, background: 'rgba(255, 181, 197, 0.1)', padding: '4px 12px', borderRadius: '16px' }}>
                        {option.sublabel}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Date and Time
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Check-in: 3:00 PM | Check-out: 11:00 AM
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(255, 181, 197, 0.1) 0%, rgba(255, 181, 197, 0.05) 100%)', borderRadius: '12px', border: '1px solid rgba(255, 181, 197, 0.2)' }}>
                  <svg width="20" height="20" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <span style={{ fontSize: '10px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter', display: 'block', fontWeight: 600 }}>Check-in (3:00 PM)</span>
                    <span style={{ fontSize: '13px', color: '#3D5A4C', fontFamily: 'Inter', fontWeight: 500 }}>
                      {checkInDate ? formatSelectedDate(checkInDate) : 'Not selected'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3" style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(255, 181, 197, 0.1) 0%, rgba(255, 181, 197, 0.05) 100%)', borderRadius: '12px', border: '1px solid rgba(255, 181, 197, 0.2)' }}>
                  <svg width="20" height="20" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span style={{ fontSize: '10px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter', display: 'block', fontWeight: 600 }}>Check-out (11:00 AM)</span>
                    <span style={{ fontSize: '13px', color: '#3D5A4C', fontFamily: 'Inter', fontWeight: 500 }}>
                      {checkOutDate ? formatSelectedDate(checkOutDate) : 'Not selected'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mode of Payment */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', boxShadow: '0px 4px 16px rgba(61, 90, 76, 0.06)', border: '1px solid rgba(61, 90, 76, 0.06)' }}>
              <div className="flex items-center gap-2 mb-4">
                <svg width="16" height="16" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
                <h3 style={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Mode of Payment
                </h3>
              </div>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px', fontFamily: 'Inter' }}>
                Select your preferred payment method
              </p>
              <div style={{ padding: '16px', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '12px', border: '1px solid rgba(61, 90, 76, 0.06)' }} className="space-y-3">
                {[
                  { value: 'cash', label: 'Cash', sublabel: 'Pay upon check-in', icon: '💵' },
                  { value: 'gcash', label: 'GCash', sublabel: 'Mobile wallet payment', icon: '📱' },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-4 cursor-pointer p-4 rounded-lg transition-all duration-200"
                    style={{
                      background: paymentMethod === option.value ? 'linear-gradient(135deg, rgba(61,90,76,0.1) 0%, rgba(61,90,76,0.05) 100%)' : 'transparent',
                      border: `2px solid ${paymentMethod === option.value ? 'rgba(61,90,76,0.3)' : 'rgba(61,90,76,0.06)'}`
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={option.value}
                      checked={paymentMethod === option.value}
                      onChange={() => setPaymentMethod(option.value as 'cash' | 'gcash')}
                      style={{ accentColor: '#3D5A4C', cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <span style={{ fontSize: '24px' }}>{option.icon}</span>
                    <div className="flex-1">
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#3D5A4C', fontFamily: 'Inter', display: 'block' }}>
                        {option.label}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'rgba(61,90,76,0.5)', fontFamily: 'Inter' }}>
                        {option.sublabel}
                      </span>
                    </div>
                    {paymentMethod === option.value && (
                      <span style={{ fontSize: '10px', color: '#22C55E', fontFamily: 'Inter', fontWeight: 600, background: 'rgba(34, 197, 94, 0.1)', padding: '4px 12px', borderRadius: '16px' }}>✓ Selected</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Your Stay Summary */}
          <div className="flex-1" style={{ background: 'linear-gradient(135deg, #3D5A4C 0%, #2D4A3C 100%)', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '16px', boxShadow: '0px 16px 48px rgba(61, 90, 76, 0.25)' }}>
            <div className="mb-8">
              <h2 className={cormorantInfant.className} style={{ fontSize: '28px', fontWeight: 400, lineHeight: '36px', color: '#FFFAF5', marginBottom: '8px' }}>
                Your Stay
              </h2>
              <div style={{ width: '40px', height: '2px', background: 'linear-gradient(90deg, #FFB5C5, #C9A962)', borderRadius: '2px' }} />
            </div>

            {/* Summary Details */}
            <div className="space-y-0" style={{ marginBottom: '48px' }}>
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Check-in</span>
                <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {formatSelectedDate(checkInDate)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Check-out</span>
                <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {formatSelectedDate(checkOutDate)}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Guests</span>
                <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {totalGuests}{hasChildren && childAgeGroup === 'under2' ? ' + 1 infant (free)' : ''}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Room</span>
                <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{roomType}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />

              {(hasPwd || hasSenior) && (
                <>
                  <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Discount</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>
                      {hasPwd ? 'PWD' : 'Senior'} (20%)
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />
                </>
              )}

              {extraBeds > 0 && (
                <>
                  <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Extra Beds</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                      {extraBeds} bed{extraBeds > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginBottom: '16px' }} />
                </>
              )}
              
              <div style={{ paddingBottom: '0px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter', display: 'block', marginBottom: '8px' }}>Included Amenities</span>
                <div className="flex flex-wrap gap-1">
                  {amenitiesList.slice(0, 3).map((amenity, idx) => (
                    <span key={idx} style={{ fontSize: '10.5px', color: '#FFB5C5', fontFamily: 'Inter', fontWeight: 500 }}>
                      {amenity}{idx < 2 && amenitiesList.length > 3 ? ',' : ''}
                    </span>
                  ))}
                  {amenitiesList.length > 3 && (
                    <span style={{ fontSize: '10.5px', color: '#FFB5C5', fontFamily: 'Inter', fontWeight: 500 }}>
                      +{amenitiesList.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.2)', marginTop: '16px' }} />
            </div>

            {/* Pricing */}
            <div className="space-y-3" style={{ marginBottom: '32px' }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>
                  Room Rate ({numberOfNights} night{numberOfNights !== 1 ? 's' : ''})
                </span>
                <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{totalRoomCost.toFixed(2)}</span>
              </div>
              {numberOfNights > 1 && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '11px', fontWeight: 400, lineHeight: '18px', color: 'rgba(255,250,245,0.5)', fontFamily: 'Inter' }}>
                    ₱{baseRate.toFixed(2)} × {numberOfNights} nights
                  </span>
                </div>
              )}
              {extraBeds > 0 && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>
                    Extra Bed{extraBeds > 1 ? 's' : ''} (×{extraBeds}{numberOfNights > 1 ? ` × ${numberOfNights} nights` : ''})
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{extraBedsFee.toFixed(2)}</span>
                </div>
              )}
              {hasDiscount && (
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>
                    {hasPwd ? 'PWD' : 'Senior'} Discount (20%)
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '20px', color: '#86EFAC', fontFamily: 'Inter' }}>−₱{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Service Charges*</span>
                <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{taxes.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.3)', marginBottom: '16px' }} />
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 400, lineHeight: '20px', color: 'rgba(255, 250, 245, 0.8)', fontFamily: 'Inter' }}>Payment Method</span>
                <span style={{ fontSize: '12px', fontWeight: 600, lineHeight: '20px', color: '#FFB5C5', fontFamily: 'Inter', textTransform: 'capitalize' }}>{paymentMethod}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.3)', marginBottom: '16px' }} />
              <div className="flex justify-between items-center" style={{ paddingTop: '8px', background: 'rgba(255, 181, 197, 0.1)', padding: '16px', borderRadius: '12px', marginLeft: '-16px', marginRight: '-16px' }}>
                <span style={{ fontSize: '18px', fontWeight: 600, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>Total</span>
                <span style={{ fontSize: '20px', fontWeight: 700, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Booking feedback messages */}
            {bookingError && (
              <div style={{ marginBottom: '12px', padding: '12px 16px', background: 'rgba(239,68,68,0.15)', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)' }}>
                <p style={{ fontSize: '11px', color: '#FCA5A5', fontFamily: 'Inter', fontWeight: 500 }}>{bookingError}</p>
              </div>
            )}
            {bookingSuccess && (
              <div style={{ marginBottom: '12px', padding: '12px 16px', background: 'rgba(34,197,94,0.15)', borderRadius: '8px', border: '1px solid rgba(34,197,94,0.3)' }}>
                <p style={{ fontSize: '11px', color: '#86EFAC', fontFamily: 'Inter', fontWeight: 500 }}>{bookingSuccess}</p>
              </div>
            )}

            {/* Confirm Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
                className="group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!checkInDate || !checkOutDate || bookingLoading}
                onClick={handleConfirmBooking}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  height: '52px',
                  background: (checkInDate && checkOutDate) ? 'linear-gradient(135deg, #FFFAF5 0%, #FFE5E5 100%)' : '#9CA3AF',
                  boxShadow: (checkInDate && checkOutDate) ? '0px 8px 24px rgba(255, 181, 197, 0.4)' : 'none',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  color: '#3D5A4C',
                  fontFamily: 'Inter',
                  cursor: (checkInDate && checkOutDate) && !bookingLoading ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (checkInDate && checkOutDate && !bookingLoading) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FFB5C5 0%, #FFA5B5 100%)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0px 12px 32px rgba(255, 181, 197, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (checkInDate && checkOutDate && !bookingLoading) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FFFAF5 0%, #FFE5E5 100%)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0px 8px 24px rgba(255, 181, 197, 0.4)';
                  }
                }}
              >
                {bookingLoading ? (
                  <>
                    <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (checkInDate && checkOutDate) ? (
                  <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirm Booking
                  </>
                ) : !checkInDate ? 'Select Check-in Date' : 'Select Check-out Date'}
              </button>
            </div>

            {/* Policies and Information */}
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p style={{ fontSize: '10px', fontWeight: 400, lineHeight: '18px', color: 'rgba(255, 250, 245, 0.7)', textAlign: 'left', fontFamily: 'Inter' }}>
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
    </div>
  );
}
