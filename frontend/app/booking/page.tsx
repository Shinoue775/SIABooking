"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant, Inter, Montserrat } from "next/font/google";
import { useState } from "react";
import chtmlogo from '../images/chtmlogo.png';
import gcllgo from '../images/gcllgo.jpg';

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const cormorantInfant = Cormorant({ subsets: ["latin"], weight: ["400"] });
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("February");
  const [currentYear, setCurrentYear] = useState(2026);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("Standard Room - ₱2,500");
  const [amenities, setAmenities] = useState("Air Conditioning");

  const daysInMonth = 28; // February 2026
  const firstDayOfWeek = 6; // February 1, 2026 is Sunday

  const roomRates: Record<string, number> = {
    "Standard Room - ₱2,500": 2500,
    "Deluxe Room - ₱4,500": 4500
  };
  const subtotal = roomRates[roomType] ?? 2500;
  const taxes = 85.00;
  const total = subtotal + taxes;

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
              <Link href="/login" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', fontWeight: 400, lineHeight: '20px' }}>
                Login
              </Link>
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
              Check-in Date (Check-in: 3:00 PM | Check-out: 11:00 AM)
            </p>
            
            <div className="group" style={{ background: '#FFFAF5', boxShadow: '0px 4px 12px rgba(61, 90, 76, 0.08)', borderRadius: '8px', padding: '32.9px', transition: 'all 0.3s ease', border: '1px solid rgba(61, 90, 76, 0.05)' }}>
              {/* Month/Year Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <button 
                  className="hover:bg-gray-100 flex items-center justify-center transition-all duration-200"
                  style={{ width: '35.99px', height: '35.99px', borderRadius: '9999px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                  onClick={() => {/* Previous month logic */}}
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
                  onClick={() => {/* Next month logic */}}
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
                  onClick={() => setGuests(Math.min(4, guests + 1))}
                  className="hover:bg-gray-100 hover:scale-110 flex items-center justify-center transition-all duration-200"
                  style={{ width: '40px', height: '40px', borderRadius: '9999px', fontSize: '13.6px', fontWeight: 400, lineHeight: '24px', color: '#3D5A4C', background: '#FFFAF5', border: '1px solid rgba(61, 90, 76, 0.2)', cursor: 'pointer', boxShadow: '0px 2px 4px rgba(61, 90, 76, 0.05)' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Room Type
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Standard Room: ₱2,500 | Deluxe Room: ₱4,500
              </p>
              <div className="flex justify-between items-center hover:border-opacity-80 hover:bg-gray-50 transition-all duration-200" style={{ padding: '16px', borderBottom: '2px solid rgba(61, 90, 76, 0.15)', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px 8px 0 0' }}>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="transition-colors duration-200"
                  style={{
                    width: '100%',
                    fontSize: '18px',
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
                  <option value="Standard Room - ₱2,500">Standard Room - ₱2,500</option>
                  <option value="Deluxe Room - ₱4,500">Deluxe Room - ₱4,500</option>
                </select>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A4C" strokeWidth="1" className="transition-transform duration-200">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#3D5A4C', display: 'block', marginBottom: '8px', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Amenities
              </h3>
              <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '16px', color: 'rgba(61, 90, 76, 0.6)', marginBottom: '20px', fontFamily: 'Inter' }}>
                Air conditioning, breakfast, TV, lounge area
              </p>
              <div className="flex justify-between items-center hover:border-opacity-80 hover:bg-gray-50 transition-all duration-200" style={{ padding: '16px', borderBottom: '2px solid rgba(61, 90, 76, 0.15)', background: 'rgba(61, 90, 76, 0.02)', borderRadius: '8px 8px 0 0' }}>
                <select
                  value={amenities}
                  onChange={(e) => setAmenities(e.target.value)}
                  className="transition-colors duration-200"
                  style={{
                    width: '100%',
                    fontSize: '18px',
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
                  <option value="Air Conditioning">Air Conditioning</option>
                  <option value="Breakfast Included">Breakfast Included</option>
                  <option value="Entertainment (TV)">Entertainment (TV)</option>
                  <option value="Lounge Area">Lounge Area</option>
                </select>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D5A4C" strokeWidth="1" className="transition-transform duration-200">
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
              <div className="relative hover:shadow-lg transition-all duration-200" style={{ width: '360px', height: '52px', background: 'rgba(255, 181, 197, 0.29)', borderRadius: '8px', border: '1px solid rgba(255, 181, 197, 0.3)' }}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '0', height: '24px', borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }} />
                <div className="flex h-full">
                  <button className="flex items-center justify-center hover:bg-black hover:bg-opacity-5 transition-all duration-200" style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '5px 0 0 5px' }}>
                    <svg width="24" height="24" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="flex items-center justify-center hover:bg-black hover:bg-opacity-5 transition-all duration-200" style={{ flex: 1, background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '0 5px 5px 0' }}>
                    <svg width="24" height="24" fill="none" stroke="#10B981" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
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
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>2/4/2026</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Guests</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{guests}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Room</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{roomType}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              
              <div className="flex justify-between items-center" style={{ paddingBottom: '0px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Amenities</span>
                <span style={{ fontSize: '11.9px', fontWeight: 500, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>{amenities}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginTop: '16px' }} />
            </div>

            {/* Pricing */}
            <div className="space-y-3" style={{ marginBottom: '32px' }}>
              <div className="flex justify-between items-center">
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Base Room Rate</span>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center" style={{ paddingBottom: '16px' }}>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>Amenities and Service Charges*</span>
                <span style={{ fontSize: '11.9px', fontWeight: 400, lineHeight: '20px', color: '#FFFAF5', fontFamily: 'Inter' }}>₱{taxes.toFixed(2)}</span>
              </div>
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.32)', marginBottom: '16px' }} />
              <div className="flex justify-between items-center" style={{ paddingTop: '8px' }}>
                <span className={cormorantInfant.className} style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5' }}>Total</span>
                <span className={cormorantInfant.className} style={{ fontSize: '17px', fontWeight: 400, lineHeight: '28px', color: '#FFB5C5' }}>₱{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <div style={{ marginBottom: '24px' }}>
              <button
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
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFB5C5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFAF5';
                }}
              >
                Confirm
              </button>
            </div>

            {/* Policies and Information */}
            <p style={{ fontSize: '10.2px', fontWeight: 400, lineHeight: '19px', color: '#FFFAF5', textAlign: 'center', fontFamily: 'Inter', paddingLeft: '59px' }}>
              - Rates may vary depending on selected amenities.<br />
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
