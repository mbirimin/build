"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Hammer, Wrench, CalendarIcon, Clock, ArrowLeft, Edit3 } from "lucide-react"
import { format } from "date-fns"

interface ProjectSelectionProps {
  onSelectProject: (project: "build" | "destroy") => void
  isAdminMode: boolean
  currentUser: string
  onLogout: () => void
}

export default function ProjectSelection({
  onSelectProject,
  isAdminMode,
  currentUser,
  onLogout,
}: ProjectSelectionProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const buildDate = new Date("2025-07-10")
  const destroyDate = new Date("2025-07-13")
  const [buildTitle, setBuildTitle] = useState("Build Day")
  const [destroyTitle, setDestroyTitle] = useState("Destroy Day")

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/ldc3.jpg')`,
          filter: "brightness(0.8)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-8">
        {/* Logout Button */}
        <div className="absolute top-4 md:top-8 right-4 md:right-8">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-white hover:bg-white/20 bg-black/40 hover:bg-black/50 px-3 md:px-6 py-2 md:py-3 font-semibold backdrop-blur-sm border border-white/20 text-sm md:text-base"
          >
            <ArrowLeft className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg">
            Select Your Project
          </h1>
          <p className="text-base md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md px-4">
            Choose the project you want to access and manage today
          </p>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-4xl w-full">
          {/* Build Day Card */}
          <Card
            className={`group cursor-pointer transition-all duration-500 transform hover:scale-105 ${
              hoveredCard === "build" ? "shadow-2xl shadow-black/50" : "shadow-xl shadow-black/30"
            } bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-3xl overflow-hidden`}
            onMouseEnter={() => setHoveredCard("build")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProject("build")}
          >
            <CardContent className="p-6 md:p-8 h-full flex flex-col">
              {/* Icon */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <Hammer className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-4 md:mb-6">
                {isAdminMode ? (
                  <Input
                    value={buildTitle}
                    onChange={(e) => setBuildTitle(e.target.value)}
                    className="text-2xl md:text-3xl font-bold text-white bg-transparent border-none text-center placeholder-white/50 p-0 h-auto focus:ring-0 mb-3 md:mb-4"
                    style={{ fontSize: "1.5rem" }}
                  />
                ) : (
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                    {buildTitle}
                  </h3>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 text-white/90">
                <CalendarIcon className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-base md:text-lg font-medium">{format(buildDate, "EEEE, MMMM d")}</span>
                {isAdminMode && <Edit3 className="w-3 md:w-4 h-3 md:h-4 ml-1 opacity-70" />}
              </div>

              {/* Description */}
              <p className="text-white/90 text-center leading-relaxed mb-6 md:mb-8 flex-1 text-sm md:text-base">
                Coordinate construction activities and track progress on build objectives.
              </p>

              {/* Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-3 md:py-4 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0"
              >
                <Clock className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                Access Build Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Destroy Day Card */}
          <Card
            className={`group cursor-pointer transition-all duration-500 transform hover:scale-105 ${
              hoveredCard === "destroy" ? "shadow-2xl shadow-black/50" : "shadow-xl shadow-black/30"
            } bg-black/30 hover:bg-black/40 backdrop-blur-xl border border-white/20 hover:border-white/30 rounded-3xl overflow-hidden`}
            onMouseEnter={() => setHoveredCard("destroy")}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onSelectProject("destroy")}
          >
            <CardContent className="p-6 md:p-8 h-full flex flex-col">
              {/* Icon */}
              <div className="flex justify-center mb-4 md:mb-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-300">
                  <Wrench className="w-6 md:w-8 h-6 md:h-8 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-4 md:mb-6">
                {isAdminMode ? (
                  <Input
                    value={destroyTitle}
                    onChange={(e) => setDestroyTitle(e.target.value)}
                    className="text-2xl md:text-3xl font-bold text-white bg-transparent border-none text-center placeholder-white/50 p-0 h-auto focus:ring-0 mb-3 md:mb-4"
                    style={{ fontSize: "1.5rem" }}
                  />
                ) : (
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                    {destroyTitle}
                  </h3>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center justify-center gap-2 mb-4 md:mb-6 text-white/90">
                <CalendarIcon className="w-4 md:w-5 h-4 md:h-5" />
                <span className="text-base md:text-lg font-medium">{format(destroyDate, "EEEE, MMMM d")}</span>
                {isAdminMode && <Edit3 className="w-3 md:w-4 h-3 md:h-4 ml-1 opacity-70" />}
              </div>

              {/* Description */}
              <p className="text-white/90 text-center leading-relaxed mb-6 md:mb-8 flex-1 text-sm md:text-base">
                Manage demolition schedules and coordinate safety protocols.
              </p>

              {/* Button */}
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-3 md:py-4 text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0"
              >
                <Clock className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                Access Destroy Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
