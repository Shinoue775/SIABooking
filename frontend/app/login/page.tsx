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
    <div className={`flex min-h-screen ${inter.className}`}>
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${loginchtmbg.src}')`
          }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center p-2">
              <Image src={chtmlogo} alt="CHTM Logo" width={112} height={112} className="object-contain" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Montserrat, serif', color: '#FF0080' }}>CHTM-RRS</h1>
              <p className="text-base font-medium mt-1 tracking-wide" style={{ fontFamily: 'Inter, serif' }}>ROOM RESERVATION SYSTEM</p>
            </div>
            <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center p-2">
              <Image 
                src={gc} 
                alt="GC Logo" 
                width={112} 
                height={112} 
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>
          <p 
            className={`text-left flex items-center mt-8 ${inter.className}`}
            style={{
              width: '430px',
              height: '96px',
              fontWeight: 500,
              fontSize: '17px',
              lineHeight: '32px',
              textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
            }}
          >
            "Enhancing service excellence through the College of Hospitality and Tourism Management"
          </p>
          <div className="w-48 h-1 bg-pink-600 mt-4 self-start" style={{ marginLeft: 'calc((100% - 430px) / 2)' }}></div>
          <p className="mt-6 text-white text-sm font-semibold self-start" style={{ marginLeft: 'calc((100% - 430px) / 2)' }}>
            CHTM Department
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-2xl px-8">
          <div className="mb-12">
            <h2 className={`text-5xl font-light mb-5 ${cormorant.className}`} style={{ color: '#3D5A4C' }}>Welcome</h2>
            <div className="w-80 h-1 bg-pink-600 mb-4"></div>
            <p className="text-gray-600 text-base font-medium">
              Please sign in using your Gordon College Google account.
            </p>
          </div>

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-4 px-4 text-lg rounded-md transition-colors font-medium bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
            >

              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={22}
                height={22}
              />

              {loading ? "Redirecting..." : "Sign in with Google"}

            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 GCATTEND. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}