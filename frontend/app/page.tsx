"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant, Inter, Montserrat } from "next/font/google";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import HomePage from "./home/page";
import chtmlogo from './images/chtmlogo.png';
import gcllgo from './images/gcllgo.jpg';
import loginchtmbg from './images/loginchtmbg.jpg';
import gcbuildingbg from './images/gcbuildingbg.jpg';

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

  if (isLoggedIn) {
    return <HomePage />;
  }

  return (
    <div className={`bg-white ${inter.className}`}>  
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md h-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Logo Section */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0">
                <Image src={chtmlogo} alt="CHTM" width={32} height={32} className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className={`font-bold ${montserrat.className}`} style={{ color: '#FF0080', fontSize: 'clamp(16px, 4vw, 24px)', lineHeight: '1.1', fontFamily: 'Montserrat, serif' }}>
                  CHTM-RRS
                </h1>
                <p className={`hidden sm:block ${inter.className}`} style={{ color: '#3D5A4C', fontSize: '7px', fontWeight: 700, lineHeight: '9px', letterSpacing: '0.3px', fontFamily: 'Inter, serif' }}>
                  ROOM RESERVATION SYSTEM
                </p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 shrink-0">
                <Image src={gcllgo} alt="GC" width={32} height={32} className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
              <Link href="/" className="relative" style={{ color: '#3D5A4C', fontSize: '11.9px', fontWeight: 500, lineHeight: '20px' }}>
                Home
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '1px', background: '#FFB5C5' }}></span>
              </Link>
              <Link href="/booking" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', lineHeight: '20px' }}>
                Booking
              </Link>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', lineHeight: '20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  Logout
                </button>
              ) : (
                <Link href="/login" style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '11.9px', lineHeight: '20px' }}>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center lg:justify-start" style={{ minHeight: 'calc(100vh - 80px)', background: '#FFFAF5' }}>
        {/* Background Image - Covers on mobile, Right Side on desktop */}
        <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[52%] h-full z-0">
          <Image 
            src={gcbuildingbg}
            alt="Building" 
            className="object-cover"
            fill
            priority
          />
          <div className="absolute inset-0 bg-black/60 lg:bg-black/50"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
          {/* Floating Card */}
          <div 
            className="bg-white/95 shadow-2xl p-8 sm:p-10 lg:p-16 mx-auto lg:mx-0 lg:ml-[8%]"
            style={{ maxWidth: '580px', width: '100%', borderLeft: '4px solid #FF0080' }}
          >
            {/* Est. 2026 */}
            <p style={{ color: '#C9A962', fontSize: '10.2px', fontWeight: 700, lineHeight: '16px' }}>
              Est. 2026
            </p>

            {/* Heading */}
            <h1 
              className={cormorant.className}
              style={{
                marginTop: '24px',
                fontSize: 'clamp(36px, 5vw, 61.2px)',
                fontWeight: 400,
                lineHeight: '1.1',
                color: '#3D5A4C'
              }}
            >
              ROOM RESERVATION
            </h1>
            {/* Paragraph */}
            <p 
              style={{
                marginTop: '16px',
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                fontWeight: 400,
                lineHeight: '1.5',
                color: 'rgba(61, 90, 76, 0.8)',
                fontFamily: 'Cormorant Garamond, serif'
              }}
            >
              Discover real-time availability, personalized options, and a seamless reservation experience designed to make every trip effortless.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start" style={{ marginTop: '32px' }}>
              <Link 
                href="/login"
                className="px-8 sm:px-12 py-4 flex items-center justify-center text-center transition hover:bg-[#2d4338]"
                style={{
                  background: '#3D5A4C',
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                  color: '#FFFAF5',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Cormorant Garamond, serif',
                  lineHeight: '20px'
                }}
              >
                Book Your Stay
              </Link>
              <Link 
                href="/login"
                className="px-8 sm:px-12 py-4 flex items-center justify-center text-center transition hover:bg-gray-50"
                style={{
                  border: '1px solid #3D5A4C',
                  background: 'white',
                  color: '#3D5A4C',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: 'Cormorant Garamond, serif',
                  lineHeight: '20px'
                }}
              >
                Check Availability
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24" style={{ background: '#FFFAF5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
            {/* Feature 1 - Artisan Dining */}
            <div className="text-left">
              <div className="mb-4 md:mb-6">
                <svg className="w-10 h-10" style={{ color: '#3D5A4C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '20.4px', lineHeight: '32px', color: '#3D5A4C', fontWeight: 400, fontFamily: 'Inter' }}>
                Artisan Dining
              </h3>
              <p style={{ marginTop: '12px', fontSize: '13.6px', lineHeight: '1.6', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter' }}>
                Locally sourced ingredients prepared with French techniques.
              </p>
            </div>

            {/* Feature 2 - Modern Comfort */}
            <div className="text-left">
              <div className="mb-4 md:mb-6">
                <svg className="w-10 h-10" style={{ color: '#3D5A4C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 style={{ fontSize: '20.4px', lineHeight: '32px', color: '#3D5A4C', fontWeight: 400, fontFamily: 'Inter' }}>
                Modern Comfort
              </h3>
              <p style={{ marginTop: '12px', fontSize: '13.6px', lineHeight: '1.6', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter' }}>
                High-speed connectivity in a space designed for tranquility.
              </p>
            </div>

            {/* Feature 3 - Prime Location */}
            <div className="text-left">
              <div className="mb-4 md:mb-6">
                <svg className="w-10 h-10" style={{ color: '#3D5A4C' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '20.4px', lineHeight: '32px', color: '#3D5A4C', fontWeight: 400, fontFamily: 'Inter' }}>
                Prime Location
              </h3>
              <p style={{marginTop: '12px', fontSize: '13.6px', lineHeight: '1.6', color: 'rgba(61, 90, 76, 0.7)', fontFamily: 'Inter' }}>
                Steps away from the city's finest cultural institutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 md:py-32" style={{ background: '#3D5A4C' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div 
              className="h-[300px] sm:h-[400px] lg:h-[650px] shadow-2xl relative w-full rounded-sm overflow-hidden order-2 lg:order-1"
            >
              <Image 
                src={loginchtmbg}
                alt="Experience"
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <p style={{ fontSize: '12px', lineHeight: '18px', color: '#FFB5C5', letterSpacing: '1px' }}>
                THE EXPERIENCE
              </p>
              
              <h2 
                className={cormorant.className}
                style={{
                  marginTop: '16px',
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 400,
                  lineHeight: '1.2',
                  color: '#FFFAF5'
                }}
              >
                Designed for the<br />
                <span style={{ color: '#FFB5C5' }}>Discerning Traveler</span>
              </h2>

              <p 
                className={cormorant.className}
                style={{
                  marginTop: '24px',
                  fontSize: 'clamp(16px, 2vw, 18px)',
                  fontWeight: 300,
                  lineHeight: '1.6',
                  color: 'rgba(255, 250, 245, 0.8)'
                }}
              >
                Experience the perfect harmony of sophisticated design and genuine hospitality. Tailored for those who appreciate the finer details, our accommodations offer a tranquil escape equipped with premium amenities. Elevate your journey and indulge in a standard of comfort that truly feels like a home away from home.
              </p>

              {/* Stats */}
              <div 
                className="flex flex-row gap-8 sm:gap-12"
                style={{
                  marginTop: '32px',
                  paddingTop: '32px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div>
                  <p style={{ fontSize: 'clamp(24px, 4vw, 32px)', lineHeight: '1.2', color: '#FFB5C5', fontWeight: 400 }}>2</p>
                  <p style={{ fontSize: '12px', lineHeight: '18px', color: '#FFFAF5', marginTop: '8px' }}>Rooms Available</p>
                </div>
                <div>
                  <p style={{ fontSize: 'clamp(24px, 4vw, 32px)', lineHeight: '1.2', color: '#FFB5C5', fontWeight: 400 }}>24/7</p>
                  <p style={{ fontSize: '12px', lineHeight: '18px', color: '#FFFAF5', marginTop: '8px' }}>Concierge Service</p>
                </div>
              </div>

              {/* Button */}
              <Link 
                href="/login"
                className="px-8 py-3 sm:px-10 sm:py-4 mt-10 inline-block text-center hover:bg-white/10 transition"
                style={{
                  border: '1px solid #FFFAF5',
                  color: '#FFFAF5',
                  fontSize: '14px',
                  fontWeight: 500,
                  lineHeight: '20px',
                  fontFamily: 'Inter',
                  background: 'transparent'
                }}
              >
                Explore Our Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 md:py-24" style={{ background: '#FFFAF5' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"> 
          {/* Stars */}
          <div className="flex gap-2 justify-center mb-8 md:mb-12">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#C9A962' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <blockquote 
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 400,
              lineHeight: '1.3',
              color: '#3D5A4C',
              textAlign: 'center',
              fontFamily: 'Cormorant Infant, serif'
            }}
          >
            "An oasis of calm in a chaotic world.<br className="hidden sm:block"/> The attention
            to detail is simply unmatched."
          </blockquote>

          {/* Attribution */}
          <p 
            style={{
              marginTop: '32px',
              fontSize: '10.2px',
              fontWeight: 700,
              lineHeight: '16px',
              color: 'rgba(61, 90, 76, 0.6)',
              textAlign: 'center',
              fontFamily: 'Inter'
            }}
          >
            — Jonathan V., Travel Weekly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16" style={{ background: 'rgba(255, 181, 197, 0.29)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8">
            {/* Logo */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0">
                  <Image src={chtmlogo} alt="CHTM" width={92} height={92} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(20px, 2.5vw, 24px)', fontWeight: 700, lineHeight: '1.2', fontFamily: 'Cormorant Garamond, serif', color: '#000' }}>
                    Gordon College
                  </h3>
                  <p style={{ fontSize: '14px', sm: '16px', fontWeight: 700, lineHeight: '1.5', color: '#E063A4', fontFamily: 'Inter', marginTop: '4px' }}>
                    CHTM
                  </p>
                </div>
              </div>
              
              <p style={{ fontSize: '14px', sm: '16px', lineHeight: '1.6', color: 'rgba(0, 0, 0, 0.6)', marginTop: '16px', maxWidth: '464px' }}>
                College of Hospitality and Tourism Management - Providing quality education and training for future hospitality professionals
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ fontSize: '20px', sm: '24px', fontWeight: 700, lineHeight: '1.2', fontFamily: 'Cormorant Garamond, serif', color: '#000' }}>
                Quick Links
              </h4>
              <div className="flex flex-col gap-2" style={{ fontSize: '14px', sm: '16px', color: 'rgba(0, 0, 0, 0.6)', marginTop: '16px' }}>
                <Link href="/" className="hover:text-black transition">Home</Link>
                <Link href="/booking" className="hover:text-black transition">Bookings</Link>
                <Link href="/calendar" className="hover:text-black transition">Calendar</Link>
                <Link href="/login" className="hover:text-black transition">Login</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '20px', sm: '24px', fontWeight: 700, lineHeight: '1.2', fontFamily: 'Cormorant Garamond, serif', color: '#000' }}>
                Contact Us
              </h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'rgba(0, 0, 0, 0.6)', marginTop: '16px', maxWidth: '305px' }}>
                Tapinac Oval Sports Complex, Donor St., East Tapinac, Olongapo, Philippines, 2200<br /><br />
                (047) 222 4080<br />
                Gordon College-CHTM
              </p>
            </div>

            {/* Social */}
            <div>
              <h4 style={{ fontSize: '20px', sm: '24px', fontWeight: 700, lineHeight: '1.2', fontFamily: 'Cormorant Garamond, serif', color: '#000' }}>
                Follow us
              </h4>
              <div className="flex gap-4 mt-6">
                {/* Facebook */}
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition hover:opacity-80" style={{ background: '#FFB5C5' }}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#E063A4" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition hover:opacity-80" style={{ background: '#FFB5C5' }}>
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="#E063A4" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-10 pt-6 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p style={{ fontSize: '12px', sm: '14px', lineHeight: '1.5', color: 'rgba(0, 0, 0, 0.6)' }}>
                &copy; {new Date().getFullYear()} Gordon College - College of Hospitality and Tourism Management. All rights reserved.
              </p>
              <p style={{ fontSize: '12px', sm: '14px', lineHeight: '1.5', color: 'rgba(0, 0, 0, 0.6)' }}>
                <span className="hover:text-black cursor-pointer transition">Privacy Policy</span> &nbsp;|&nbsp; <span className="hover:text-black cursor-pointer transition">Terms and Conditions</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
