"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Trash2,
  Plus,
  Clock,
  CheckCircle2,
  PlayCircle,
  AlertCircle,
  ArrowLeft,
  Hammer,
  Calendar,
  LogOut,
  Timer,
} from "lucide-react"

export default function DesignOption2() {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url(/construction-bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Hammer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Build Day Schedule</h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Sunday, June 1, 2025
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Overall Progress</div>
                <div className="text-xl font-bold text-blue-600">62%</div>
              </div>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Not Started Column */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
              <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-gray-600" />
                    Not Started
                  </h3>
                  <Badge className="bg-gray-200 text-gray-700">2</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <Card className="border-2 border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Electrical Setup</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        13:00 - 17:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        4h 0m
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">3 subtasks</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Plumbing Installation</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        09:00 - 11:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        2h 0m
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">2 subtasks</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
              <div className="bg-blue-50 px-4 py-3 rounded-t-lg border-b border-blue-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                    <PlayCircle className="w-4 h-4 text-blue-600" />
                    In Progress
                  </h3>
                  <Badge className="bg-blue-200 text-blue-800">3</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <Card className="border-2 border-blue-300 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Foundation Setup</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        08:00 - 12:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        4h 0m
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">4 subtasks</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-300 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Framing Work</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        10:00 - 15:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        5h 0m
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="font-semibold">40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">2 subtasks</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Completed Column */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
              <div className="bg-emerald-50 px-4 py-3 rounded-t-lg border-b border-emerald-200">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Completed
                  </h3>
                  <Badge className="bg-emerald-200 text-emerald-800">3</Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <Card className="border-2 border-emerald-300 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Site Preparation</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        07:00 - 08:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        1h 0m
                      </div>
                    </div>
                    <div className="mb-3">
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-emerald-600 font-medium">✓ Complete</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-emerald-300 shadow-sm">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2">Material Delivery</h4>
                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        06:00 - 07:00
                      </div>
                      <div className="flex items-center gap-2">
                        <Timer className="w-3 h-3" />
                        1h 0m
                      </div>
                    </div>
                    <div className="mb-3">
                      <Progress value={100} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-emerald-600 font-medium">✓ Complete</div>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Add Task Button */}
          <div className="mt-6 text-center">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
