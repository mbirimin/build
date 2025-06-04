"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, User, Shield } from "lucide-react"

interface LoginPageProps {
  onBack: () => void
  onLogin: (userType: "admin" | "user") => void
}

export default function LoginPage({ onBack, onLogin }: LoginPageProps) {
  const [selectedUserType, setSelectedUserType] = useState<"admin" | "user" | null>(null)
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (!selectedUserType) {
      setError("Please select user type")
      return
    }

    if (!username.trim()) {
      setError("Please enter username")
      return
    }

    // Simple authentication
    if (selectedUserType === "admin" && username === "admin") {
      onLogin("admin")
    } else if (selectedUserType === "user" && username === "user") {
      onLogin("user")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/construction-bg2.jpg')`,
          filter: "brightness(0.8)",
        }}
      />

      {/* Reduced Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900/15 to-orange-900/20" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
        {/* Back Button */}
        <div className="absolute top-4 md:top-8 left-4 md:left-8">
          <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 p-2 md:p-3">
            <ArrowLeft className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
            Login Required
          </h1>
          <p className="text-base md:text-xl text-gray-200 max-w-md mx-auto drop-shadow-md px-4">
            Please select your access level and enter your credentials
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-sm md:max-w-md bg-black/20 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl overflow-hidden mx-4">
          <CardHeader className="text-center pb-3 md:pb-4 bg-white/10 backdrop-blur-sm text-white border-b border-white/20">
            <CardTitle className="text-xl md:text-2xl font-bold drop-shadow-sm">Authentication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-8 text-white">
            {/* User Type Selection */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-sm font-medium text-white">Select Access Level</label>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                <Button
                  variant={selectedUserType === "user" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedUserType("user")
                    setError("")
                  }}
                  className={`h-14 md:h-16 flex flex-col gap-1 md:gap-2 ${
                    selectedUserType === "user"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "hover:bg-blue-50 text-black border-white/30 bg-white/80"
                  }`}
                >
                  <User className="w-5 md:w-6 h-5 md:h-6" />
                  <span className="text-xs md:text-sm font-medium">User</span>
                </Button>
                <Button
                  variant={selectedUserType === "admin" ? "default" : "outline"}
                  onClick={() => {
                    setSelectedUserType("admin")
                    setError("")
                  }}
                  className={`h-14 md:h-16 flex flex-col gap-1 md:gap-2 ${
                    selectedUserType === "admin"
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "hover:bg-orange-50 text-black border-white/30 bg-white/80"
                  }`}
                >
                  <Shield className="w-5 md:w-6 h-5 md:h-6" />
                  <span className="text-xs md:text-sm font-medium">Admin</span>
                </Button>
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Username</label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError("")
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-10 md:h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 backdrop-blur-sm text-base"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">{error}</div>
            )}

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full h-10 md:h-12 text-base md:text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              Access Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
