"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant, Inter, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import chtmlogo from '../images/chtmlogo.png';
import gcllgo from '../images/gcllgo.jpg';

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const cormorantInfant = Cormorant({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function BookingPage() {
  const BACKEND_URL = '';
  const [selectedDate, setSelectedDate] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("February");
  const [currentYear, setCurrentYear] = useState(2026);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [guests, setGuests] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  
  const availableAmenities = [
    { id: 1, name: "Full Air Condition" },
    { id: 2, name: "Basic" },
  ];

  const [selectedAmenities, setSelectedAmenities] = useState<{ id: number, name: string }[]>([
    { id: 1, name: "Full Air Condition" }
  ]);
  const [rooms, setRooms] = useState<{ id: number; label: string }[]>([]);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const renderSelect = (
    value: string | number,
    onChange: (value: string) => void,
    options: Array<{ value: string | number; label: string }>,
    placeholder?: string
  ) => (
    <div
      style={{
        position: 'relative',
        border: '1px solid rgba(61, 90, 76, 0.15)',
        background: '#FFFAF5',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: '100%',
          minHeight: '52px',
          padding: '14px 44px 14px 16px',
          fontSize: 'clamp(14px, 4vw, 16px)',
          fontWeight: 400,
          lineHeight: '24px',
          color: '#3D5A4C',
          fontFamily: 'Inter',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none'
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#3D5A4C"
        strokeWidth="1.5"
        style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/rooms`);
        const data = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          setRooms([]);
          setRoomId(null);
          return;
        }

        const normalizedRooms = data
          .sort((left, right) => {
            const leftLabel = String(left.room_number || left.number || left.name || left.id || '');
            const rightLabel = String(right.room_number || right.number || right.name || right.id || '');
            return leftLabel.localeCompare(rightLabel, undefined, { numeric: true, sensitivity: 'base' });
          })
          .slice(0, 2)
          .map((room, index) => ({
            id: Number(room.id),
            label: `Room ${index + 1}`,
          }))
          .filter((room) => Number.isFinite(room.id));

        setRooms(normalizedRooms);
        setRoomId(normalizedRooms[0]?.id ?? null);
      } catch {
        setRooms([]);
        setRoomId(null);
      }
    };

    fetchRooms();
  }, [BACKEND_URL]);

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Please login first to make a booking.");
        setLoading(false);
        return;
      }

      if (!roomId) {
        setError("Please select a room.");
        setLoading(false);
        return;
      }

      const monthIndex = monthNames.indexOf(currentMonth);
      if (monthIndex < 0) {
        setError("Invalid month selected.");
        setLoading(false);
        return;
      }

      const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;
      
      const start_at = `${dateStr}T${checkInTime}:00`;
      const end_at = `${dateStr}T${checkOutTime}:00`;

      if (new Date(end_at) <= new Date(start_at)) {
        setError("Check-out time must be later than check-in time.");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          room_id: roomId,
          start_at: new Date(start_at).toISOString(),
          end_at: new Date(end_at).toISOString(),
          guests,
          amenities: selectedAmenities.map(a => a.id),
        }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess("Booking confirmed successfully!");
      } else {
        setError(data.error || "Booking failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSuccess("Logged out successfully.");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (rooms.length === 0) {
      return;
    }

    const roomStillExists = rooms.some((room) => room.id === roomId);
    if (!roomStillExists) {
      setRoomId(rooms[0]?.id ?? null);
    }
  }, [roomId, rooms]);

  const currentMonthIndex = monthNames.indexOf(currentMonth);
  const safeMonthIndex = currentMonthIndex >= 0 ? currentMonthIndex : 0;
  const daysInMonth = new Date(currentYear, safeMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, safeMonthIndex, 1).getDay();

  useEffect(() => {
    if (selectedDate > daysInMonth) {
      setSelectedDate(daysInMonth);
    }
  }, [selectedDate, daysInMonth]);

  const handlePreviousMonth = () => {
    if (safeMonthIndex === 0) {
      setCurrentMonth(monthNames[11]);
      setCurrentYear((prev) => prev - 1);
      return;
    }

    setCurrentMonth(monthNames[safeMonthIndex - 1]);
  };

  const handleNextMonth = () => {
    if (safeMonthIndex === 11) {
      setCurrentMonth(monthNames[0]);
      setCurrentYear((prev) => prev + 1);
      return;
    }

    setCurrentMonth(monthNames[safeMonthIndex + 1]);
  };

  const selectedRoom = rooms.find(r => r.id === roomId);
  const selectedRoomLabel = selectedRoom?.label ?? "—";

  return (
    <div className={`min-h-screen ${inter.className}`} style={{ background: '#FFFAF5' }}>
      {/* Navbar with Hamburger Menu */}
      <nav className="sticky top-0 z-50" style={{ background: 'rgba(254, 253, 253, 0.95)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* Logo Section */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <Image src={chtmlogo} alt="CHTM" width={40} height={40} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className={`font-bold leading-tight ${montserrat.className}`} style={{ color: '#FF0080', fontSize: 'clamp(14px, 4vw, 20px)' }}>
                  CHTM-RRS
                </h1>
                <p className={`hidden xs:block ${inter.className}`} style={{ color: '#3D5A4C', fontSize: 'clamp(6px, 2vw, 7px)', fontWeight: 700, letterSpacing: '0.3px' }}>
                  ROOM RESERVATION SYSTEM
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                <Image src={gcllgo} alt="GC" width={40} height={40} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 lg:gap-12 items-center">
              <Link href="/" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: 400 }}>
                Home
              </Link>
              <Link href="/booking" className="relative" style={{ color: '#3D5A4C', fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: 500 }}>
                Booking
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '0.99px', background: '#FFB5C5' }}></span>
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: 500, background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: 'clamp(11px, 2vw, 12px)', fontWeight: 400 }}>
                  Login
                </Link>
              )}
            </div>

            {/* Hamburger Menu Button - Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out ${
                    isMenuOpen ? 'rotate-45 top-2' : 'top-0'
                  }`}
                />
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] top-2 transition-opacity duration-300 ease-in-out ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute left-0 w-full h-0.5 bg-[#3D5A4C] transition-all duration-300 ease-in-out ${
                    isMenuOpen ? '-rotate-45 top-2' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
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
              href="/booking" 
              onClick={closeMenu}
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

      {/* Main Content - Responsive Padding */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <p style={{ fontSize: 'clamp(12px, 3vw, 15px)', fontWeight: 700, color: '#FFB5C5', marginBottom: '8px' }}>
            RESERVATION
          </p>
          <h1
            className={cormorantInfant.className}
            style={{ fontSize: 'clamp(32px, 8vw, 51px)', fontWeight: 400, lineHeight: '1.2', color: '#3D5A4C' }}
          >
            Secure Your Stay
          </h1>
        </div>

        {/* Booking Form Grid - Responsive Stacking */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left Column - Calendar */}
          <div className="w-full lg:flex-1">
            <h2 className={cormorantInfant.className} style={{ fontSize: 'clamp(28px, 6vw, 51px)', fontWeight: 400, color: '#3D5A4C', marginBottom: '12px' }}>
              Calendar
            </h2>
            <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', fontWeight: 500, color: 'rgba(61, 90, 76, 0.7)', marginBottom: '20px' }}>
              Check-in Date
            </p>

            <div style={{ background: '#FFFAF5', boxShadow: '0px 4px 12px rgba(61, 90, 76, 0.08)', borderRadius: '8px', padding: 'clamp(16px, 4vw, 32px)', border: '1px solid rgba(61, 90, 76, 0.05)' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <button
                  className="hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
                  style={{ width: '36px', height: '36px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  onClick={handlePreviousMonth}
                >
                  <svg width="20" height="20" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  <span style={{ fontSize: 'clamp(14px, 4vw, 17px)', color: '#3D5A4C' }}>
                    {currentMonth}
                  </span>
                  <span style={{ fontSize: 'clamp(14px, 4vw, 17px)', color: '#3D5A4C' }}>
                    ,
                  </span>
                  <span style={{ fontSize: 'clamp(14px, 4vw, 17px)', color: '#FFB5C5' }}>
                    {currentYear}
                  </span>
                </div>

                <button
                  className="hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
                  style={{ width: '36px', height: '36px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  onClick={handleNextMonth}
                >
                  <svg width="20" height="20" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid - Responsive */}
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div
                      key={day}
                      className="text-center"
                      style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', fontWeight: 700, color: 'rgba(61, 90, 76, 0.4)', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div style={{ height: '0.99px', background: 'rgba(201, 169, 98, 0.2)', marginBottom: '16px' }} />

                {/* Calendar Days - Responsive Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: 'clamp(40px, 8vw, 48px)' }} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isSelected = day === selectedDate;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{
                          width: '100%',
                          aspectRatio: '1/1',
                          maxWidth: 'clamp(35px, 8vw, 48px)',
                          background: isSelected ? '#F0E0E0' : 'transparent',
                          borderRadius: '9999px',
                          color: isSelected ? '#3D5A4C' : 'rgba(61, 90, 76, 0.8)',
                          fontSize: 'clamp(11px, 3vw, 14px)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          border: 'none',
                          margin: '0 auto'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Calendar Legend - Responsive */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4" style={{ borderTop: '0.99px solid rgba(201, 169, 98, 0.2)' }}>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F0E0E0' }}></div>
                  <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.7)' }}>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981' }}></div>
                  <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.7)' }}>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444' }}></div>
                  <span style={{ fontSize: 'clamp(9px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.7)' }}>Unavailable</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Form Fields */}
          <div className="w-full lg:flex-1 space-y-6 md:space-y-8">
            {/* Guests */}
            <div>
              <h3 style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 600, color: '#3D5A4C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Guests
              </h3>
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px' }}>
                Number of guests
              </p>
              <div className="flex items-center justify-center gap-4 sm:gap-6 p-4" style={{ background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px' }}>
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: 'clamp(13px, 3vw, 16px)', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer' }}
                >
                  −
                </button>
                <span style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 500, color: '#3D5A4C', minWidth: '50px', textAlign: 'center' }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: 'clamp(13px, 3vw, 16px)', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Room */}
            <div>
              <h3 style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 600, color: '#3D5A4C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Room
              </h3>
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px' }}>
                Select your preferred room
              </p>
              {renderSelect(
                roomId ?? '',
                (value) => setRoomId(value ? Number(value) : null),
                rooms.map((room) => ({ value: room.id, label: room.label })),
                'Select a room...'
              )}
            </div>

            {/* Amenities */}
            <div>
              <h3 style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 600, color: '#3D5A4C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Amenities
              </h3>
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px' }}>
                Choose room amenities
              </p>
              {renderSelect(
                selectedAmenities[0]?.id ?? '',
                (value) => {
                  const amenity = availableAmenities.find((item) => item.id === Number(value));
                  if (amenity) {
                    setSelectedAmenities([amenity]);
                  }
                },
                availableAmenities.map((amenity) => ({ value: amenity.id, label: amenity.name }))
              )}
            </div>

            {/* Date and Time */}
            <div>
              <h3 style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 600, color: '#3D5A4C', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Date and Time
              </h3>
              <p style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '16px' }}>
                Select date and time slot
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label style={{ fontSize: '10px', color: 'rgba(61, 90, 76, 0.6)', display: 'block', marginBottom: '4px' }}>
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: 'clamp(13px, 3vw, 14px)',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(61, 90, 76, 0.2)',
                      fontFamily: 'Inter'
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label style={{ fontSize: '10px', color: 'rgba(61, 90, 76, 0.6)', display: 'block', marginBottom: '4px' }}>
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: 'clamp(13px, 3vw, 14px)',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(61, 90, 76, 0.2)',
                      fontFamily: 'Inter'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Your Stay Summary */}
          <div className="w-full lg:flex-1" style={{ background: '#3D5A4C', padding: 'clamp(24px, 5vw, 40px)', borderRadius: '8px', boxShadow: '0px 8px 24px rgba(61, 90, 76, 0.2)' }}>
            <h2 className={cormorantInfant.className} style={{ fontSize: 'clamp(20px, 5vw, 24px)', fontWeight: 400, color: '#FFFAF5', marginBottom: '32px' }}>
              Your Stay
            </h2>

            {/* Summary Details */}
            <div className="mb-8">
              <div className="flex justify-between items-center pb-4">
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFFAF5' }}>Check-in</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 500, color: '#FFFAF5' }}>
                  {currentMonth.slice(0, 3)} {selectedDate}, {currentYear}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center pb-4">
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFFAF5' }}>Guests</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 500, color: '#FFFAF5' }}>{guests}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center pb-4">
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFFAF5' }}>Room</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 500, color: '#FFFAF5' }}>
                  {selectedRoomLabel}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center pb-4">
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFFAF5' }}>Time</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 500, color: '#FFFAF5', textAlign: 'right' }}>
                  {checkInTime} - {checkOutTime}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center">
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FFFAF5' }}>Amenities</span>
                <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', fontWeight: 500, color: '#FFFAF5', textAlign: 'right' }}>
                  {selectedAmenities.length > 0 ? selectedAmenities.map(a => a.name).join(", ") : "None"}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginTop: '16px' }} />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#FCA5A5', textAlign: 'center' }}>{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <p style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#6EE7B7', textAlign: 'center' }}>{success}</p>
              </div>
            )}

            {/* Confirm Button */}
            <div className="mb-6">
              {isLoggedIn ? (
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="group/btn hover:scale-105 transition-all duration-200 w-full"
                  style={{
                    maxWidth: '257px',
                    width: '100%',
                    height: '48px',
                    background: loading ? '#ccc' : '#FFFAF5',
                    boxShadow: '0px 4px 12px rgba(255, 181, 197, 0.3)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: 'clamp(11px, 2.5vw, 12px)',
                    fontWeight: 500,
                    color: '#3D5A4C',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.background = '#FFB5C5';
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.background = '#FFFAF5';
                  }}
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
              ) : (
                <Link href="/login" className="block w-full" style={{ textDecoration: 'none' }}>
                  <button
                    type="button"
                    className="group/btn hover:scale-105 transition-all duration-200 w-full"
                    style={{
                      maxWidth: '257px',
                      width: '100%',
                      height: '48px',
                      background: '#FFFAF5',
                      boxShadow: '0px 4px 12px rgba(255, 181, 197, 0.3)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: 'clamp(11px, 2.5vw, 12px)',
                      fontWeight: 500,
                      color: '#3D5A4C',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#FFB5C5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#FFFAF5';
                    }}
                  >
                    Login to Book
                  </button>
                </Link>
              )}
            </div>

            {/* Cancellation Policy */}
            <p style={{ fontSize: 'clamp(9px, 2.5vw, 11px)', color: '#FFFAF5', textAlign: 'center' }}>
              Cancellation is free up to 48 hours before check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
