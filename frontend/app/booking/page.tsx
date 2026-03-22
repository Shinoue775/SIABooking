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
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sia-backup.vercel.app';
  const [selectedDate, setSelectedDate] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("February");
  const [currentYear, setCurrentYear] = useState(2026);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [guests, setGuests] = useState(2);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
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
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: '24px',
          color: '#3D5A4C',
          fontFamily: 'Inter',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          appearance: 'auto',
          WebkitAppearance: 'menulist',
          MozAppearance: 'menulist'
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
      const start_at = `${dateStr}T${startTime}:00`;
      const end_at = `${dateStr}T${endTime}:00`;

      if (new Date(end_at) <= new Date(start_at)) {
        setError("End time must be later than start time.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`, {
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
  };

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
      {/* Navbar */}
      <nav className="sticky top-0 z-50 h-20" style={{ background: 'rgba(254, 253, 253, 0.91)', boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)' }}>
        <div className="max-w-7xl mx-auto px-12 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8">
                <Image src={chtmlogo} alt="CHTM" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-center">
                <h1 className={`font-bold ${montserrat.className}`} style={{ color: '#FF0080', fontSize: '24px', lineHeight: '26px', fontFamily: 'Montserrat, serif' }}>
                  CHTM-RRS
                </h1>
                <p className={inter.className} style={{ color: '#3D5A4C', fontSize: '7px', fontWeight: 700, lineHeight: '9px', letterSpacing: '0.3px', fontFamily: 'Inter, serif' }}>ROOM RESERVATION SYSTEM</p>
              </div>
              <div className="w-8 h-8">
                <Image src={gcllgo} alt="GC" width={32} height={32} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex gap-12">
              <Link href="/" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', fontWeight: 400, lineHeight: '20px' }}>
                Home
              </Link>
              <Link href="/booking" className="relative" style={{ color: '#3D5A4C', fontSize: '11.9px', fontWeight: 500, lineHeight: '20px' }}>
                Booking
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '0.99px', background: '#FFB5C5' }}></span>
              </Link>
              <Link href="/calendar" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', fontWeight: 400, lineHeight: '20px' }}>
                Calendar
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', fontWeight: 400, lineHeight: '20px' }}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="px-12 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <p style={{ fontSize: '15px', fontWeight: 700, lineHeight: '16px', color: '#FFB5C5', fontFamily: 'Inter', letterSpacing: '0px', marginBottom: '8px' }}>
            RESERVATION
          </p>
          <h1
            className={cormorantInfant.className}
            style={{ fontSize: '51px', fontWeight: 400, lineHeight: '60px', color: '#3D5A4C' }}
          >
            Secure Your Stay
          </h1>
        </div>

        {/* Booking Form Grid */}
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Left Column - Calendar */}
          <div className="flex-1">
            <h2 className={cormorantInfant.className} style={{ fontSize: '51px', fontWeight: 400, lineHeight: '60px', color: '#3D5A4C', marginBottom: '16px' }}>
              Calendar
            </h2>
            <p style={{ fontSize: '10.2px', fontWeight: 500, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter', marginBottom: '32px' }}>
              Check-in Date
            </p>

            <div className="group" style={{ background: '#FFFAF5', boxShadow: '0px 4px 12px rgba(61, 90, 76, 0.08)', borderRadius: '8px', padding: '32.9px', transition: 'all 0.3s ease', border: '1px solid rgba(61, 90, 76, 0.05)' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <button
                  className="hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
                  style={{ width: '35.99px', height: '35.99px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  onClick={handlePreviousMonth}
                >
                  <svg width="20" height="20" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center" style={{ gap: '1px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    {currentMonth}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    ,
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                    {currentYear}
                  </span>
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
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '48px' }} />
                  ))}

                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isSelected = day === selectedDate;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className="flex items-center justify-center transition-all duration-200 hover:scale-105"
                        style={{
                          width: '38.71px',
                          height: '48px',
                          background: isSelected ? '#F0E0E0' : 'transparent',
                          borderRadius: '9999px',
                          color: isSelected ? '#3D5A4C' : 'rgba(61, 90, 76, 0.8)',
                          fontSize: '11.9px',
                          fontWeight: 500,
                          lineHeight: '20px',
                          fontFamily: 'Inter',
                          cursor: 'pointer',
                          border: 'none',
                          boxShadow: isSelected ? '0px 2px 8px rgba(240, 224, 224, 0.4)' : 'none'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Form Fields */}
          <div className="flex-1 space-y-10">
            {/* Guests */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Guests
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Number of guests
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
                  onClick={() => setGuests(guests + 1)}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: '13.6px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer', boxShadow: '0px 2px 4px rgba(61, 90, 76, 0.05)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Room */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Room
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
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
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Amenities
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
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
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Date and Time
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Select date and time slot
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 auto', minWidth: '140px' }}>
                  <label style={{ fontSize: '10px', color: 'rgba(61, 90, 76, 0.6)', fontFamily: 'Inter', display: 'block', marginBottom: '4px' }}>
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '14px',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(61, 90, 76, 0.2)',
                      fontFamily: 'Inter',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ flex: '1 1 auto', minWidth: '140px' }}>
                  <label style={{ fontSize: '10px', color: 'rgba(61, 90, 76, 0.6)', fontFamily: 'Inter', display: 'block', marginBottom: '4px' }}>
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '14px',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(61, 90, 76, 0.2)',
                      fontFamily: 'Inter',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Your Stay Summary */}
          <div className="flex-1" style={{ background: '#3D5A4C', padding: '40px', borderRadius: '8px', boxShadow: '0px 8px 24px rgba(61, 90, 76, 0.2)' }}>
            <h2 className={cormorantInfant.className} style={{ fontSize: '24px', fontWeight: 400, lineHeight: '32px', color: '#FFFAF5', marginBottom: '64px' }}>
              Your Stay
            </h2>

            {/* Summary Details */}
            <div className="space-y-0" style={{ marginBottom: '48px' }}>
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Check-in</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {currentMonth.slice(0, 3)} {selectedDate}, {currentYear}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Guests</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{guests}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Room</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>
                  {selectedRoomLabel}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Time</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter', textAlign: 'right' }}>
                  {startTime} - {endTime}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />

              <div className="flex justify-between items-center" style={{ paddingBottom: '0px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Amenities</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter', textAlign: 'right' }}>
                  {selectedAmenities.length > 0 ? selectedAmenities.map(a => a.name).join(", ") : "None"}
                </span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginTop: '16px' }} />
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '4px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#FCA5A5', fontFamily: 'Inter' }}>{error}</p>
              </div>
            )}
            {success && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '4px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6EE7B7', fontFamily: 'Inter' }}>{success}</p>
              </div>
            )}

            {/* Confirm Button */}
            <div style={{ marginBottom: '24px' }}>
              {isLoggedIn ? (
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="group/btn hover:scale-105 transition-all duration-200"
                  style={{
                    width: '257px',
                    height: '48px',
                    background: loading ? '#ccc' : '#FFFAF5',
                    boxShadow: '0px 4px 12px rgba(255, 181, 197, 0.3)',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11.9px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: '#3D5A4C',
                    fontFamily: 'Inter',
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
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <button
                    type="button"
                    className="group/btn hover:scale-105 transition-all duration-200"
                    style={{
                      width: '257px',
                      height: '48px',
                      background: '#FFFAF5',
                      boxShadow: '0px 4px 12px rgba(255, 181, 197, 0.3)',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '11.9px',
                      fontWeight: 500,
                      lineHeight: '20px',
                      color: '#3D5A4C',
                      fontFamily: 'Inter',
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
            <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '19px', color: '#FFFAF5', textAlign: 'center', fontFamily: 'Inter', paddingLeft: '59px' }}>
              Cancellation is free up to 48 hours before check-in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}