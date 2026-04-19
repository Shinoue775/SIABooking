'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import logo from '../images/logos1.png'
import gordoncolllegelogo from '../images/chtmlogo.png'
import gcbuildingbg from '../images/gcbuildingbg.jpg'
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
  ChevronLeft, Sparkles, Award, Clock, Building2, X,
  Wind, ShowerHead, Sofa, Armchair
} from 'lucide-react'

// Define the room details structure
interface RoomDetails {
  id: string;
  title: string;
  type: string;
  price: number;
  description: string;
  amenities: string[];
  images: any[];
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const [roomCount, setRoomCount] = useState<number | null>(null)
  const [guestCount, setGuestCount] = useState<number | null>(null)

  // Room A slideshow with smooth fade transition
  const roomAImages = [img1, img2, img3, img4, img5]
  const [roomAIndex, setRoomAIndex] = useState(0)
  const [roomAImageLoaded, setRoomAImageLoaded] = useState(true)

  // Room B slideshow with smooth fade transition
  const roomBImages = [img6, img7, img8, img9, img10]
  const [roomBIndex, setRoomBIndex] = useState(0)
  const [roomBImageLoaded, setRoomBImageLoaded] = useState(true)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<RoomDetails | null>(null)
  const [modalImageIndex, setModalImageIndex] = useState(0)
  const [modalImageLoaded, setModalImageLoaded] = useState(true)

  const roomData: Record<string, RoomDetails> = {
    A: {
      id: 'A',
      title: 'Deluxe Room A',
      type: 'Deluxe',
      price: 4500,
      description: 'A luxurious deluxe room featuring two king-sized beds, a relaxing bathtub, mini sala for lounging, and premium amenities for the ultimate comfort experience.',
      amenities: ['Air Conditioning', 'Smart TV', 'Bathtub', '2 King Beds', 'Mini Sala', 'Cabinet', 'Premium Shower'],
      images: roomAImages
    },
    B: {
      id: 'B',
      title: 'Standard Room B',
      type: 'Standard',
      price: 2500,
      description: 'A comfortable standard room with two single beds, complete with air conditioning, TV, cabinet storage, and a refreshing shower for a pleasant stay.',
      amenities: ['Air Conditioning', 'TV', '2 Single Beds', 'Cabinet', 'Shower', 'Basic Amenities'],
      images: roomBImages
    }
  }

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

  // Auto-advance modal slideshow
  useEffect(() => {
    if (isModalOpen && selectedRoom) {
      const intervalModal = setInterval(() => {
        setModalImageLoaded(false)
        setTimeout(() => {
          setModalImageIndex((prev) => (prev + 1) % selectedRoom.images.length)
          setModalImageLoaded(true)
        }, 300)
      }, 4000)
      return () => clearInterval(intervalModal)
    }
  }, [isModalOpen, selectedRoom])

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats')
        if (res.ok) {
          const data = await res.json()
          setRoomCount(data.roomCount)
          setGuestCount(data.guestCount)
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
        // silently keep null values on error
      }
    }
    fetchStats()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsLoggedIn(false)
    setMobileMenuOpen(false)
    router.replace('/')
  }

  const handleBookingClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault()
      router.push('/login')
    }
  }

  const closeMenu = () => setMobileMenuOpen(false)

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

  const handleModalImageChange = (newIndex: number) => {
    if (newIndex === modalImageIndex) return
    setModalImageLoaded(false)
    setTimeout(() => {
      setModalImageIndex(newIndex)
      setModalImageLoaded(true)
    }, 300)
  }

  const openRoomModal = (roomKey: string) => {
    setSelectedRoom(roomData[roomKey])
    setModalImageIndex(0)
    setModalImageLoaded(true)
    setIsModalOpen(true)
  }

  const getAmenityIcon = (amenity: string) => {
    if (amenity.includes('Air')) return <Wind className="w-4 h-4 text-green-600" />
    if (amenity.includes('TV')) return <Tv className="w-4 h-4 text-green-600" />
    if (amenity.includes('Shower') || amenity.includes('Bathtub')) return <Bath className="w-4 h-4 text-green-600" />
    if (amenity.includes('Sala') || amenity.includes('Sofa')) return <Sofa className="w-4 h-4 text-green-600" />
    if (amenity.includes('Cabinet')) return <Armchair className="w-4 h-4 text-green-600" />
    return <Sparkles className="w-4 h-4 text-green-600" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar - Matching other pages with hamburger menu */}
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
              <Link href="/" className="relative py-2" style={{ color: '#3D5A4C', fontSize: '14px', fontWeight: 500 }}>
                Home
                <span className="absolute left-0 bottom-0 w-full" style={{ height: '1px', background: '#FFB5C5' }}></span>
              </Link>
              <Link 
                href={isLoggedIn ? "/booking" : "/login"} 
                onClick={handleBookingClick}
                className="py-2" 
                style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '14px' }}
              >
                Booking
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
              style={{ color: '#3D5A4C', fontSize: '16px', fontWeight: 500 }}
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
              style={{ color: 'rgba(61, 90, 76, 0.7)', fontSize: '16px' }}
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

      {/* Hero Section - Responsive */}
      <div className="relative bg-gray-900 min-h-[500px] h-[70vh] max-h-[600px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${gcbuildingbg.src})`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full container mx-auto px-4 max-w-7xl flex flex-col items-center justify-center text-center text-white">
          <div className="max-w-3xl px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-xs sm:text-sm">Welcome to CHTM Room Reservation System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              Experience Comfort & Excellence
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-6 sm:mb-8 px-2">
              Discover premium accommodations in the heart of the Gordon College campus
            </p>
          </div>

          {/* Stats - Responsive grid */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            {[
              { number: roomCount !== null ? String(roomCount) : '…', label: 'Rooms', icon: Building2 },
              { number: guestCount !== null ? String(guestCount) : '…', label: 'Guests', icon: Users },
              { number: '24/7', label: 'Support', icon: Clock },
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="text-center">
                  <div className="flex justify-center mb-1">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" />
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-[10px] sm:text-xs text-gray-300">{stat.label}</div>
                </div>
              )
            })}
          </div>

          {/* Search Bar - Responsive */}
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-3 sm:p-4 mx-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select className="flex-1 p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm">
                <option>Select room type</option>
                <option>Standard Room - ₱2,500</option>
                <option>Deluxe Room - ₱4,500</option>
              </select>
              <input 
                type="date" 
                className="flex-1 p-2.5 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm"
              />
              <button className="bg-green-700 hover:bg-green-800 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm">
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Rooms Section */}
      <main className="container mx-auto px-4 max-w-7xl py-8 sm:py-12">
        {/* Featured Room - Deluxe Room A */}
        <div className="mb-12 sm:mb-16">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">FEATURED ROOM</h2>
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          </div>

          {/* Room A - Deluxe Room */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] md:w-1/2 bg-gray-900">
                <div className="absolute inset-0">
                  <Image
                    src={roomAImages[roomAIndex]}
                    alt={`Deluxe Room A ${roomAIndex + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${roomAImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Navigation Controls */}
                <button
                  onClick={() => handleRoomAChange((roomAIndex - 1 + roomAImages.length) % roomAImages.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleRoomAChange((roomAIndex + 1) % roomAImages.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {roomAImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRoomAChange(idx)}
                      className={`transition-all duration-300 ${
                        idx === roomAIndex 
                          ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-white rounded-full' 
                          : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                  {roomAIndex + 1} / {roomAImages.length}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 sm:p-8 md:w-1/2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-green-800">{roomData.A.title}</h3>
                    <p className="text-lg sm:text-xl font-semibold text-green-700 mt-1">₱{roomData.A.price.toLocaleString()}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto">
                    {roomData.A.type}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
                  <p className="text-gray-600 italic text-xs sm:text-sm">
                    "{roomData.A.description}"
                  </p>
                </div>

                <button 
                  onClick={() => openRoomModal('A')}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 sm:py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  View Room Details
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Available Rooms */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 sm:mb-8">Currently Available Rooms</h2>
          
          {/* Room B - Standard Room */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative h-[300px] sm:h-[350px] md:h-[400px] md:w-1/2 md:order-2 bg-gray-900">
                <div className="absolute inset-0">
                  <Image
                    src={roomBImages[roomBIndex]}
                    alt={`Standard Room B ${roomBIndex + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-500 ${roomBImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Navigation Controls */}
                <button
                  onClick={() => handleRoomBChange((roomBIndex - 1 + roomBImages.length) % roomBImages.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => handleRoomBChange((roomBIndex + 1) % roomBImages.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                  {roomBImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleRoomBChange(idx)}
                      className={`transition-all duration-300 ${
                        idx === roomBIndex 
                          ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-white rounded-full' 
                          : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full'
                      }`}
                    />
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                  {roomBIndex + 1} / {roomBImages.length}
                </div>
              </div>

              {/* Details Section */}
              <div className="p-6 sm:p-8 md:w-1/2 md:order-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-green-800">{roomData.B.title}</h3>
                    <p className="text-lg sm:text-xl font-semibold text-green-700 mt-1">₱{roomData.B.price.toLocaleString()}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold self-start sm:self-auto">
                    {roomData.B.type}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-6">
                  <p className="text-gray-600 italic text-xs sm:text-sm">
                    "{roomData.B.description}"
                  </p>
                </div>

                <button 
                  onClick={() => openRoomModal('B')}
                  className="w-full bg-green-700 hover:bg-green-800 text-white py-2.5 sm:py-3 rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  View Room Details
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Card (Modal) for Room Details - WITH MOVING IMAGES */}
      {isModalOpen && selectedRoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
            {/* Close button (Top Right) */}
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-white/90 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition shadow-sm"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800" />
            </button>
            
            {/* Modal Header/Image Slideshow */}
            <div className="relative h-56 sm:h-64 md:h-72 w-full bg-gray-900">
              <div className="absolute inset-0">
                <Image 
                  src={selectedRoom.images[modalImageIndex]} 
                  alt={`${selectedRoom.title} ${modalImageIndex + 1}`} 
                  fill 
                  className={`object-cover transition-opacity duration-500 ${modalImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Navigation Controls */}
              <button
                onClick={() => handleModalImageChange((modalImageIndex - 1 + selectedRoom.images.length) % selectedRoom.images.length)}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleModalImageChange((modalImageIndex + 1) % selectedRoom.images.length)}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 sm:p-2 transition"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
                {selectedRoom.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleModalImageChange(idx)}
                    className={`transition-all duration-300 ${
                      idx === modalImageIndex 
                        ? 'w-4 sm:w-6 h-1.5 sm:h-2 bg-white rounded-full' 
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80 rounded-full'
                    }`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 bg-black/50 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
                {modalImageIndex + 1} / {selectedRoom.images.length}
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{selectedRoom.title}</h2>
                <span className="bg-white/20 backdrop-blur-md px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">
                  {selectedRoom.type} Room
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Room Overview</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-5 sm:mb-6 leading-relaxed">
                {selectedRoom.description}
              </p>

              <div className="mb-4">
                <span className="text-2xl font-bold text-green-700">₱{selectedRoom.price.toLocaleString()}</span>
                <span className="text-gray-500 text-sm ml-2">per night</span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Amenities Included</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
                {selectedRoom.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-100">
                    {getAmenityIcon(amenity)}
                    <span className="text-xs sm:text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>

              {/* Modal Actions - ALWAYS SIDE BY SIDE */}
              <div className="flex flex-row items-center justify-end gap-3 border-t border-gray-100 pt-5 sm:pt-6 w-full">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 sm:flex-none px-2 sm:px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition text-sm sm:text-base whitespace-nowrap text-center"
                >
                  Close
                </button>
                <Link 
                  href={isLoggedIn ? "/booking" : "/login"}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      router.push('/login');
                    }
                    setIsModalOpen(false);
                  }}
                  className="flex-[2] sm:flex-none bg-green-700 hover:bg-green-800 text-white px-3 sm:px-8 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  Book This Room
                  <ChevronRight className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Copied from LandingPage */}
      <footer className="py-10 sm:py-12 md:py-16" style={{ background: 'rgba(255, 181, 197, 0.29)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 shrink-0">
                  <Image src={gordoncolllegelogo} alt="CHTM" width={96} height={96} className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#000' }}>
                    Gordon College
                  </h3>
                  <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', fontWeight: 700, color: '#E063A4', marginTop: '4px' }}>
                    CHTM
                  </p>
                </div>
              </div>

              <p style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', lineHeight: '1.6', color: 'rgba(0, 0, 0, 0.6)', marginTop: '16px' }}>
                College of Hospitality and Tourism Management - Providing quality education and training for future hospitality professionals
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#000' }}>
                Quick Links
              </h4>
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/" className="hover:text-black transition" style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: 'rgba(0, 0, 0, 0.6)' }}>Home</Link>
                <Link
                  href={isLoggedIn ? "/booking" : "/login"}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault();
                      router.push('/login');
                    }
                  }}
                  className="hover:text-black transition"
                  style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', color: 'rgba(0, 0, 0, 0.6)' }}
                >
                  Bookings
                </Link>
              </div>
            </div>

            <div className="text-center sm:text-left">
              <h4 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#000' }}>
                Contact Us
              </h4>
              <p style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', lineHeight: '1.6', color: 'rgba(0, 0, 0, 0.6)', marginTop: '16px' }}>
                Tapinac Oval Sports Complex, Donor St., East Tapinac, Olongapo, Philippines, 2200
              </p>
              <p style={{ fontSize: 'clamp(13px, 3.5vw, 14px)', lineHeight: '1.6', color: 'rgba(0, 0, 0, 0.6)', marginTop: '12px' }}>
                (047) 222 4080<br />
                Gordon College-CHTM
              </p>
            </div>

            <div className="text-center sm:text-left">
              <h4 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 700, color: '#000' }}>
                Follow us
              </h4>
              <div className="flex gap-4 justify-center sm:justify-start mt-6">
                <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition hover:opacity-80" style={{ background: '#FFB5C5' }}>
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="#E063A4" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition hover:opacity-80" style={{ background: '#FFB5C5' }}>
                  <svg className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="#E063A4" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-300">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
              <p style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: 'rgba(0, 0, 0, 0.6)' }}>
                &copy; {new Date().getFullYear()} Gordon College - College of Hospitality and Tourism Management. All rights reserved.
              </p>
              <p style={{ fontSize: 'clamp(11px, 3vw, 12px)', color: 'rgba(0, 0, 0, 0.6)' }}>
                <span className="hover:text-black cursor-pointer transition">Privacy Policy</span> &nbsp;|&nbsp; <span className="hover:text-black cursor-pointer transition">Terms and Conditions</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
