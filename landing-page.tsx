"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface LandingPageProps {
  onLogin: () => void
}

export default function LandingPage({ onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/construction-bg.jpg')`,
          filter: "brightness(0.8)",
        }}
      />

      {/* Reduced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/15 to-orange-900/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            2025 Dublin Convention
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-orange-400 mb-6 md:mb-8 drop-shadow-lg bg-gradient-to-r from-orange-300 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
            Engine Room Build Team Command Centre
          </h2>

          <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 drop-shadow-md font-medium px-4">
            Your Central Hub for Build Operations
          </p>

          {/* Login Button */}
          <Button
            onClick={onLogin}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 md:py-6 px-8 md:px-12 text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
          >
            Access Command Centre
            <ArrowRight className="w-5 md:w-6 h-5 md:h-6 ml-2 md:ml-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
