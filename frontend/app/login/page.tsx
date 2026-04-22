"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Cormorant, Inter } from "next/font/google";
import chtmlogo from '../images/chtmlogo.png'
import gc from '../images/gc.png'
import loginchtmbg from '../images/loginchtmbg.jpg'
import { supabase } from "../../lib/supabaseClient";

const cormorant = Cormorant({ subsets: ["latin"], weight: ["300", "400", "600"] });
const inter = Inter({ subsets: ["latin"] });

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    if (!agreed) {
      setError("Please agree to the Terms and Conditions to continue")
      return
    }

    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          hd: "gordoncollege.edu.ph"
        }
      }
    })

    if (error) {
      setError("Unable to login with Google")
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Branding with Image */}
      <div className="relative lg:w-1/2 min-h-[400px] sm:min-h-[450px] lg:min-h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={loginchtmbg}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50 lg:bg-black/40"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 sm:p-8 md:p-10 lg:p-12 text-white">
          {/* Logo Row */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
              <Image src={chtmlogo} alt="CHTM Logo" width={96} height={96} className="object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Montserrat, serif', color: '#FF0080' }}>CHTM-RRS</h1>
              <p className="text-[10px] sm:text-xs md:text-sm font-medium mt-1 tracking-wide" style={{ fontFamily: 'Inter, serif' }}>ROOM RESERVATION SYSTEM</p>
            </div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center p-2 shadow-lg">
              <Image 
                src={gc} 
                alt="GC Logo" 
                width={96} 
                height={96} 
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Quote Container - For proper alignment */}
          <div className="w-full max-w-[500px] mx-auto lg:mx-0">
            {/* Quote Text */}
            <p 
              className={`text-center lg:text-left ${inter.className}`}
              style={{
                fontWeight: 500,
                fontSize: 'clamp(13px, 3vw, 17px)',
                lineHeight: 'clamp(22px, 4vw, 32px)',
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              "Enhancing service excellence through the College of Hospitality and Tourism Management"
            </p>
            
            {/* Pink divider - Full width match to quote */}
            <div className="w-full h-1 bg-pink-600 mt-4"></div>
            
            {/* Department label - Directly below pink line */}
            <p className="mt-4 text-white text-xs sm:text-sm font-semibold text-center lg:text-left">
              CHTM Department
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          {/* Welcome Section */}
          <div className="mb-8 sm:mb-10 md:mb-12 text-center lg:text-left">
            <h2 
              className={`font-light mb-3 sm:mb-4 md:mb-5 ${cormorant.className}`} 
              style={{ 
                color: '#3D5A4C', 
                fontSize: 'clamp(28px, 7vw, 48px)'
              }}
            >
              Welcome
            </h2>
            <div className="w-40 sm:w-56 md:w-64 h-1 bg-pink-600 mb-3 sm:mb-4 mx-auto lg:mx-0"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Please sign in using your Gordon College Google account.
            </p>
          </div>

          {/* Login Button Section */}
          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 sm:py-4 px-4 text-base sm:text-lg rounded-md transition-all font-medium bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
                className="sm:w-[22px] sm:h-[22px]"
              />
              <span className="text-sm sm:text-base">
                {loading ? "Redirecting..." : "Sign in with Google"}
              </span>
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md animate-fadeIn">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Terms and Conditions Agreement - Moved below sign-in button */}
          <div className="mt-6">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => {
                    setAgreed(e.target.checked)
                    if (e.target.checked) setError(null)
                  }}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:border-pink-600 peer-checked:bg-pink-600 transition-all duration-200 group-hover:border-pink-400"></div>
                <svg
                  className="absolute w-3 h-3 text-white left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="text-sm text-gray-700 flex-1">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2 transition-colors"
                >
                  Terms and Conditions
                </button>
                {" "}and{" "}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </div>

          {/* Footer Links */}
          <div className="mt-8 sm:mt-10 text-center space-y-2">
            <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-gray-500">
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-pink-600 transition-colors"
              >
                Terms
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-pink-600 transition-colors"
              >
                Privacy
              </button>
              <span className="text-gray-300">•</span>
              <button
                onClick={() => setShowTerms(true)}
                className="hover:text-pink-600 transition-colors"
              >
                Help
              </button>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2026 CHTMRRS. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 sm:px-8 sm:py-5 flex items-center justify-between">
              <h3 
                className={`text-2xl sm:text-3xl ${cormorant.className}`}
                style={{ color: '#3D5A4C' }}
              >
                Terms & Conditions
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-6 sm:px-8 sm:py-8 overflow-y-auto max-h-[calc(85vh-80px)]">
              <div className="space-y-6 text-gray-700">
                <div className="bg-gradient-to-r from-pink-50 to-transparent p-4 rounded-lg border-l-4 border-pink-600">
                  <p className="text-sm text-gray-600">
                    Please read these terms carefully before using the CHTM Room Reservation System.
                  </p>
                </div>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h4>
                  <p className="text-sm leading-relaxed">
                    By accessing and using the CHTM Room Reservation System (CHTM-RRS), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">2. Eligibility</h4>
                  <p className="text-sm leading-relaxed">
                    This system is exclusively for Gordon College faculty, staff, and authorized personnel. You must use your official Gordon College Google account (@gordoncollege.edu.ph) to access the system.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">3. Room Rates & Amenities</h4>
                  <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Rates include all listed amenities</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Extra mattress charge: <span className="font-semibold">₱700</span></span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">Maximum of <span className="font-semibold">4 persons</span> per room</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">PWD discount: <span className="font-semibold">20%</span></span>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">4. Guest & Occupancy Policy</h4>
                  <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Children 2 years old and below stay <span className="font-semibold text-green-600">free</span></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Children 3 years old and above are counted as additional guests</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Additional guests are subject to room capacity and corresponding charges</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Extra bed requests are subject to availability</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">5. Check-in & Check-out Policy</h4>
                  <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Early check-in is subject to room availability</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Late check-in is accepted until <span className="font-semibold">9:00 PM</span>; arrivals beyond this time are considered no-show</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">6. Booking Confirmation & Cancellation</h4>
                  <div className="bg-gray-50 p-5 rounded-xl space-y-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a2 2 0 002.828 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">Admin will contact guests at <span className="font-semibold">3:00 PM</span> for booking confirmation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">Cancellation is <span className="font-semibold text-green-600">free</span> up to <span className="font-semibold">48 hours</span> before check-in</span>
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">7. Code of Conduct</h4>
                  <p className="text-sm leading-relaxed">
                    Users are expected to maintain professional conduct, leave rooms in good condition, and report any damages or issues immediately. Failure to comply may result in account suspension and/or additional charges.
                  </p>
                </section>

                <section className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">8. Privacy Policy</h4>
                  <p className="text-sm leading-relaxed">
                    We collect and process your Gordon College email address, name, and reservation data solely for the purpose of managing room reservations. Your information will never be shared with third parties without your explicit consent, except as required by law.
                  </p>
                </section>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setAgreed(true)
                  setShowTerms(false)
                  setError(null)
                }}
                className="w-full sm:flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                I Agree
              </button>
              <button
                onClick={() => setShowTerms(false)}
                className="w-full sm:flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
