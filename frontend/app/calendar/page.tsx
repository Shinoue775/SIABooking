"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant, Inter, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import chtmlogo from '../images/chtmlogo.png';
import gcllgo from '../images/gcllgo.jpg';


const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CalendarPage() {
  const today = new Date();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(MONTHS[today.getMonth()]);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const monthIndex = MONTHS.indexOf(currentMonth);

  const getDayName = (day: number) => {
    const date = new Date(currentYear, monthIndex, day);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Calculate days in current month and first day of week dynamically
  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, monthIndex, 1).getDay();

  const [rooms, setRooms] = useState<Array<{ id?: string | number; name: string; floor: string; available: boolean }>>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handlePrevMonth = () => {
    const idx = MONTHS.indexOf(currentMonth);
    if (idx === 0) {
      setCurrentMonth(MONTHS[11]);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth(MONTHS[idx - 1]);
    }
    setSelectedDate(1);
  };

  const handleNextMonth = () => {
    const idx = MONTHS.indexOf(currentMonth);
    if (idx === 11) {
      setCurrentMonth(MONTHS[0]);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth(MONTHS[idx + 1]);
    }
    setSelectedDate(1);
  };

  // Fetch availability when date changes
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingRooms(true);
      try {
        const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`;

        const res = await fetch(`/api/rooms/availability?date=${dateStr}`);
        const data = await res.json();

        if (res.ok && data.rooms) {
          setRooms(data.rooms.map((r: any) => ({
            id: r.id,
            name: r.name || r.room_number || `Room ${r.number ?? 'N/A'}`,
            floor: r.floor
              ? `${r.floor}${r.number ? `, Room ${r.number}` : ''}`
              : r.room_number
                ? `Room ${r.room_number}`
                : `Room ${r.number ?? 'N/A'}`,
            available: r.available,
          })));
        } else {
          setRooms([]);
        }
      } catch (err) {
        console.error('Failed to fetch availability:', err);
        setRooms([]);
      } finally {
        setLoadingRooms(false);
      }
    };

    fetchAvailability();
  }, [selectedDate, currentMonth, currentYear]);

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
              <Link href="/booking" style={{ color: 'rgba(61, 90, 76, 0.75)', fontSize: '11.9px', fontWeight: 500, lineHeight: '20px' }}>
                Booking
              </Link>
              <Link href="/calendar" className="relative" style={{ color: '#3D5A4C', fontSize: '11.9px', fontWeight: 400, lineHeight: '20px' }}>
                Calendar
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '0.99px', background: '#FFB5C5' }}></span>
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
      <div className="relative px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <p style={{ fontSize: '10.2px', fontWeight: 700, lineHeight: '16px', color: '#FFB5C5', fontFamily: 'Inter' }}>
            AVAILABILITY
          </p>
          <h1
            style={{ fontSize: '51px', fontWeight: 400, lineHeight: '60px', color: '#3D5A4C', marginTop: '8px', fontFamily: 'Cormorant Infant, serif' }}
          >
            Plan Your Visit
          </h1>
        </div>

        {/* Description - Top Right */}
        <div className="absolute right-12 top-24">
          <p style={{ fontSize: '13.6px', fontWeight: 400, lineHeight: '24px', color: 'rgba(61, 90, 76, 0.6)', textAlign: 'right', maxWidth: '416px', fontFamily: 'Inter' }}>
            Select a date to view available rooms and rates for your<br />
            upcoming stay at ___________.
          </p>
        </div>

        {/* Calendar and Room Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Calendar */}
          <div style={{ background: '#FFFFFF', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', padding: '33px', maxWidth: '831px' }}>
            <div style={{ background: '#FFFAF5', boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)', borderRadius: '2px', padding: '32px' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  className="hover:bg-gray-100 flex items-center justify-center"
                  style={{ width: '36px', height: '36px', borderRadius: '9999px' }}
                  onClick={handlePrevMonth}
                >
                  <svg className="w-5 h-5" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#3D5A4C', fontFamily: 'Inter' }}>
                    {currentMonth}
                  </span>
                  <span style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5', fontFamily: 'Inter' }}>
                    {currentYear}
                  </span>
                </div>

                <button
                  className="hover:bg-gray-100 flex items-center justify-center"
                  style={{ width: '36px', height: '36px', borderRadius: '9999px' }}
                  onClick={handleNextMonth}
                >
                  <svg className="w-5 h-5" fill="none" stroke="#3D5A4C" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
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
                <div style={{ height: '0.99px', background: 'rgba(201, 169, 98, 0.2)', marginBottom: '16px' }}></div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ height: '48px' }} />
                  ))}

                  {/* Days of the month */}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                    const isSelected = day === selectedDate;

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className="flex items-center justify-center transition-colors"
                        style={{
                          height: '48px',
                          background: isSelected ? '#F0E0E0' : 'transparent',
                          borderRadius: '9999px',
                          color: isSelected ? '#3D5A4C' : 'rgba(61, 90, 76, 0.8)',
                          fontSize: '11.9px',
                          fontWeight: 500,
                          fontFamily: 'Inter',
                          cursor: 'pointer',
                          border: 'none'
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-8 mt-12">
                  <div className="flex items-center gap-3">
                    <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#F0E0E0' }}></div>
                    <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter' }}>Selected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#991B1B' }}></div>
                    <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter' }}>Unavailable Rooms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Availability */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-8">

              {/* Selected Date */}
              <h2
                className={cormorant.className}
                style={{ fontSize: '28px', fontWeight: 600, color: '#3D5A4C', marginBottom: '32px' }}
              >
                {getDayName(selectedDate)}, {currentMonth} {selectedDate}
              </h2>

              {/* Room Cards */}
              <div className="space-y-6 mb-8">
                {loadingRooms ? (
                  <p style={{ fontSize: '13px', color: 'rgba(61, 90, 76, 0.6)' }}>Loading room availability...</p>
                ) : rooms.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'rgba(61, 90, 76, 0.6)' }}>No rooms were returned for the selected date.</p>
                ) : rooms.map((room, index) => (
                  <div key={index}>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#3D5A4C' }}>
                      {room.name}
                    </h3>
                    <p style={{ fontSize: '12px', color: 'rgba(61, 90, 76, 0.6)', marginTop: '4px' }}>
                      {room.floor}
                    </p>
                    <div className="mt-3">
                      <span
                        className="inline-block px-3 py-1 rounded text-xs font-semibold"
                        style={{
                          background: room.available ? '#10B981' : '#EF4444',
                          color: '#fff'
                        }}
                      >
                        {room.available ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div className="flex gap-2 mb-6 p-4 rounded" style={{ background: 'rgba(61, 90, 76, 0.05)' }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="rgba(61, 90, 76, 0.7)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div style={{ fontSize: '12px', color: 'rgba(61, 90, 76, 0.7)', lineHeight: '18px' }}>
                  Minimum stay of 2 hrs.
                </div>
              </div>

              {/* Continue Button */}
              <button
                className="w-full py-4 rounded"
                onClick={() => router.push('/booking')}
                style={{
                  background: '#3D5A4C',
                  color: '#FFFAF5',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Inter',
                  cursor: 'pointer',
                  border: 'none'
                }}
              >
                Continue to Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
