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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Side - Branding with Image (Now visible on all screen sizes) */}
      <div className="relative lg:w-1/2 min-h-[300px] sm:min-h-[350px] lg:min-h-screen">
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
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-6 sm:p-8 md:p-10 lg:p-12 text-white min-h-[300px] sm:min-h-[350px] lg:min-h-screen">
          {/* Logo Row - Responsive sizing */}
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

          {/* Quote Text - Responsive */}
          <p 
            className={`text-center lg:text-left flex items-center mt-4 sm:mt-6 lg:mt-8 ${inter.className}`}
            style={{
              maxWidth: 'min(90%, 500px)',
              width: '100%',
              fontWeight: 500,
              fontSize: 'clamp(13px, 3vw, 17px)',
              lineHeight: 'clamp(22px, 4vw, 32px)',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
            }}
          >
            "Enhancing service excellence through the College of Hospitality and Tourism Management"
          </p>
          
          {/* Pink divider - Centered on mobile, left aligned on desktop */}
          <div className="w-32 sm:w-40 md:w-48 h-1 bg-pink-600 mt-4 mx-auto lg:mx-0" style={{ marginLeft: 'auto', marginRight: 'auto', lg: { marginLeft: 0 } }}></div>
          
          {/* Department label */}
          <p className="mt-5 sm:mt-6 text-white text-xs sm:text-sm font-semibold text-center lg:text-left">
            CHTM Department
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-white">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 sm:px-6 md:px-8 py-8 sm:py-12">
          {/* Welcome Section - Responsive typography */}
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
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3 sm:py-4 px-4 text-base sm:text-lg rounded-md transition-colors font-medium bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-shadow"
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
          <div className="mt-8 sm:mt-10 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2025 GCATTEND. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
