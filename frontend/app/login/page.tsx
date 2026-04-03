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
  const router = useRouter()

  const handleGoogleLogin = async () => {
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
    <div className={`flex flex-col lg:flex-row min-h-screen ${inter.className}`}>
      {/* Left Side - Branding (Hidden on mobile, visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${loginchtmbg.src}')`
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-8 xl:p-12 text-white">
          {/* Logo Row - Responsive sizing */}
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center p-2">
              <Image src={chtmlogo} alt="CHTM Logo" width={112} height={112} className="object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ fontFamily: 'Montserrat, serif', color: '#FF0080' }}>CHTM-RRS</h1>
              <p className="text-xs sm:text-sm md:text-base font-medium mt-1 tracking-wide" style={{ fontFamily: 'Inter, serif' }}>ROOM RESERVATION SYSTEM</p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center p-2">
              <Image 
                src={gc} 
                alt="GC Logo" 
                width={112} 
                height={112} 
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Quote Text - Responsive width */}
          <p 
            className={`text-left flex items-center mt-6 sm:mt-8 ${inter.className}`}
            style={{
              maxWidth: 'min(90%, 430px)',
              width: '100%',
              fontWeight: 500,
              fontSize: 'clamp(14px, 2.5vw, 17px)',
              lineHeight: 'clamp(24px, 4vw, 32px)',
              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}
          >
            "Enhancing service excellence through the College of Hospitality and Tourism Management"
          </p>
          
          {/* Pink divider - Responsive positioning */}
          <div className="w-32 sm:w-40 md:w-48 h-1 bg-pink-600 mt-4 self-start" style={{ marginLeft: 'max(5%, calc((100% - min(90%, 430px)) / 2))' }}></div>
          
          {/* Department label */}
          <p className="mt-6 text-white text-xs sm:text-sm font-semibold self-start" style={{ marginLeft: 'max(5%, calc((100% - min(90%, 430px)) / 2))' }}>
            CHTM Department
          </p>
        </div>
      </div>

      {/* Right Side - Login Form (Now responsive and full width on mobile) */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white min-h-screen lg:min-h-0">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          {/* Welcome Section - Responsive typography */}
          <div className="mb-8 sm:mb-10 md:mb-12 text-center sm:text-left">
            <h2 
              className={`font-light mb-3 sm:mb-4 md:mb-5 ${cormorant.className}`} 
              style={{ 
                color: '#3D5A4C', 
                fontSize: 'clamp(32px, 8vw, 48px)'
              }}
            >
              Welcome
            </h2>
            <div className="w-48 sm:w-64 md:w-80 h-1 bg-pink-600 mb-3 sm:mb-4 mx-auto sm:mx-0"></div>
            <p className="text-gray-600 text-sm sm:text-base font-medium px-2 sm:px-0">
              Please sign in using your Gordon College Google account.
            </p>
          </div>

          {/* Login Button Section */}
          <div className="space-y-4 sm:space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 sm:py-4 px-4 text-base sm:text-lg rounded-md transition-colors font-medium bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
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
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Footer Copyright - Responsive */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 GCATTEND. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
