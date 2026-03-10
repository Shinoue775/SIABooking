'use client'

import React from 'react'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../images/logos1.png'
import gordoncolllegelogo from '../images/chtmlogo.png'
import img1 from '../images/1.jpg'
import img2 from '../images/2.jpg'
import img3 from '../images/3.jpg'
import img4 from '../images/4.jpg'
import img5 from '../images/5.jpg'
import img6 from '../images/6.jpg'
import img7 from '../images/7.jpg'
import img8 from '../images/8.jpg'
import img9 from '../images/9.jpg'
import img10 from '../images/10.jpg'
import { 
  Calendar, Menu, Search, Star, Users, 
  BookOpen, MapPin, Phone, Facebook, Twitter, Instagram, 
  ChevronRight, Wifi, Coffee, Bath, Tv,
  ChevronLeft, Sparkles, Award, Clock, Building2
} from 'lucide-react'

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Room A slideshow with smooth fade transition
  const roomAImages = [img1, img2, img3, img4, img5]
  const [roomAIndex, setRoomAIndex] = useState(0)
  const [roomAImageLoaded, setRoomAImageLoaded] = useState(true)

  // Room B slideshow with smooth fade transition
  const roomBImages = [img6, img7, img8, img9, img10]
  const [roomBIndex, setRoomBIndex] = useState(0)
  const [roomBImageLoaded, setRoomBImageLoaded] = useState(true)

  // Auto-advance slideshows
  useEffect(() => {
    const intervalA = setInterval(() => {
      setRoomAImageLoaded(false)
      setTimeout(() => {
        setRoomAIndex((prev) => (prev + 1) % roomAImages.length)
        setRoomAImageLoaded(true)
      }, 300)
    }, 5000)
    return () => clearInterval(intervalA)
  }, [roomAImages.length])

  useEffect(() => {
    const intervalB = setInterval(() => {
      setRoomBImageLoaded(false)
      setTimeout(() => {
        setRoomBIndex((prev) => (prev + 1) % roomBImages.length)
        setRoomBImageLoaded(true)
      }, 300)
    }, 5000)
    return () => clearInterval(intervalB)
  }, [roomBImages.length])

  const handleRoomAChange = (newIndex: number) => {
    if (newIndex === roomAIndex) return
    setRoomAImageLoaded(false)
    setTimeout(() => {
      setRoomAIndex(newIndex)
      setRoomAImageLoaded(true)
    }, 300)
  }

  const handleRoomBChange = (newIndex: number) => {
    if (newIndex === roomBIndex) return
    setRoomBImageLoaded(false)
    setTimeout(() => {
      setRoomBIndex(newIndex)
      setRoomBImageLoaded(true)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Without Login/Logout */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image 
                src={logo} 
                alt="CHTM-RRS Logo"
                width={160}
                height={53}
                className="object-contain h-14 w-auto"
                priority
              />
            </Link>
            
            {/* Desktop Navigation - Only navigation links */}
            <nav className="hidden md:flex items-center space-x-8">
              {['Home', 'Booking', 'Calendar'].map((item) => (
                <a 
                  key={item}
                  href="/booking" 
                  className="text-gray-600 hover:text-green-700 transition font-medium"
                >
                  {item}
                </a>
              ))}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <nav className="flex flex-col space-y-3">
                {['Home', 'Booking', 'Calendar'].map((item) => (
                  <a key={item} href="#" className="text-gray-700 hover:text-green-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition">
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Simplified */}
      <div className="relative bg-gray-900 h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 max-w-7xl flex flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">Welcome to CHTM Room Reservation System</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Experience Comfort & Excellence
            </h1>
            <p className="text-lg text-gray-200 mb-8">
              Discover premium accommodations in the heart of the Gordon College campus
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { number: '50+', label: 'Rooms', icon: Building2 },
              { number: '1000+', label: 'Guests', icon: Users },
              { number: '24/7', label: 'Support', icon: Clock },
              { number: '4.8', label: 'Rating', icon: Star }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-1">
                    <Icon className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-xs text-gray-300">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Search Bar - Simplified */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm">
                <option>Select room type</option>
                <option>Standard Room</option>
                <option>Deluxe Room</option>
                <option>Executive Suite</option>
                <option>Family Room</option>
              </select>
              <input 
                type="date" 
                className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm"
              />
              <button className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Rooms Section */}
      <main className="container mx-auto px-4 max-w-7xl py-12">
        {/* Featured Room */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-gray-800">FEATURED ROOM</h2>
            <Award className="w-6 h-6 text-yellow-500" />
          </div>

          {/* Room A - Featured Room */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image Section */}
              <div className="relative h-[400px] bg-gray-900">
                <div className="absolute inset-0">
                  <Image
                    src={roomAImages[roomAIndex]}
                    alt={`Room A ${roomAIndex + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${roomAImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Navigation Controls */}
                <button
                  onClick={() => handleRoomAChange((roomAIndex - 1 + roomAImages.length) % roomAImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRoomAChange((roomAIndex + 1) % roomAImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {roomAImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRoomAChange(idx)}
                      className={`transition-all duration-300 ${
                        idx === roomAIndex 
                          ? 'w-6 h-2 bg-white rounded-full' 
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {roomAIndex + 1} / {roomAImages.length}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-green-800">Room A</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Premium
                  </span>
                </div>

                {/* Rating */}
                

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: Wifi, label: 'Free WiFi' },
                    { icon: Coffee, label: 'Breakfast' },
                    { icon: Bath, label: 'Private Bath' },
                    { icon: Tv, label: 'Smart TV' }
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Icon className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-700">{item.label}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Review */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-600 italic text-sm">
                    "A spacious, premium room designed for relaxation and productivity — modern finishes, warm lighting, and thoughtful touches for an elevated stay."
                  </p>
                  
                </div>

                {/* Button */}
                <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                  View Room Details
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Currently Available Rooms</h2>
          
          {/* Room B - Same design as Room A */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image Section - Image on the right */}
              <div className="relative h-[400px] bg-gray-900 md:order-2">
                <div className="absolute inset-0">
                  <Image
                    src={roomBImages[roomBIndex]}
                    alt={`Room B ${roomBIndex + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${roomBImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Navigation Controls */}
                <button
                  onClick={() => handleRoomBChange((roomBIndex - 1 + roomBImages.length) % roomBImages.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRoomBChange((roomBIndex + 1) % roomBImages.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {roomBImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRoomBChange(idx)}
                      className={`transition-all duration-300 ${
                        idx === roomBIndex 
                          ? 'w-6 h-2 bg-white rounded-full' 
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80 rounded-full'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {roomBIndex + 1} / {roomBImages.length}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-8 md:order-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-green-800">Room B</h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Standard
                  </span>
                </div>

                {/* Rating */}
                

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: Wifi, label: 'Free WiFi' },
                    { icon: Coffee, label: 'Coffee Maker' },
                    { icon: Bath, label: 'Private Bath' },
                    { icon: Tv, label: 'LED TV' }
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-full">
                        <Icon className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-gray-700">{item.label}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Review */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-gray-600 italic text-sm">
                    "A comfortable, well-appointed standard room that covers all essentials with clean, efficient layout and reliable comforts for a restful stay."
                  </p>
                </div>

                {/* Button */}
                <button className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg transition font-medium flex items-center justify-center gap-2">
                  View Room Details
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Simplified */}
      <footer style={{ backgroundColor: '#e8cae4' }} className="text-gray-800 mt-16">
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Contact Info */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image 
                  src={gordoncolllegelogo} 
                  alt="Gordon College Logo"
                  width={50}
                  height={50}
                  className="object-contain"
                />
                <div>
                  <h5 className="text-xl font-bold">Gordon College</h5>
                  <p className="text-sm text-black-400">College of Hospitality and Tourism Management</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-black-400">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                  <span>Ephraim Oak Sports Complex, Dagon St., East Tampack, Orangepe, Philippines, 2200</span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <span>0471 222 0400</span>
                </p>
                <p className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <span>Gordon College-CHTM</span>
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-black-400">
                {['Home', 'Bookings', 'Calendar', 'About Us', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h5 className="text-lg font-semibold mb-4">Connect With Us</h5>
              <div className="flex space-x-3">
                <a href="#" className="bg-white-800 p-3 rounded-lg hover:bg-gray-700 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="bg-white-800 p-3 rounded-lg hover:bg-gray-700 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="bg-white-800 p-3 rounded-lg hover:bg-gray-700 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-sm text-black-400 text-center">
              © {new Date().getFullYear()} Gordon College - College of Hospitality and Tourism Management. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}