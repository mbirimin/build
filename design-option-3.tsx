"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trash2, Plus, CheckCircle2, PlayCircle, AlertCircle, ArrowLeft, Hammer, Calendar, LogOut } from "lucide-react"

export default function DesignOption3() {
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
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-lg shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Projects
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Hammer className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">Build Day Timeline</h1>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Sunday, June 1, 2025
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">3</div>
                    <div className="text-xs text-gray-600">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">5</div>
                    <div className="text-xs text-gray-600">Pending</div>
                  </div>
                </div>
                <button className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Time Header */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl mb-6 border-0">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Daily Timeline</h2>
                <Button className="bg-blue-500 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="grid grid-cols-12 gap-2 text-center text-sm text-gray-600 border-b pb-2">
                <div className="font-medium">6AM</div>
                <div className="font-medium">7AM</div>
                <div className="font-medium">8AM</div>
                <div className="font-medium">9AM</div>
                <div className="font-medium">10AM</div>
                <div className="font-medium">11AM</div>
                <div className="font-medium">12PM</div>
                <div className="font-medium">1PM</div>
                <div className="font-medium">2PM</div>
                <div className="font-medium">3PM</div>
                <div className="font-medium">4PM</div>
                <div className="font-medium">5PM</div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Timeline */}
          <div className="space-y-4">
            {/* Task 1 */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Site Preparation</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <div className="bg-emerald-400 rounded h-8 flex items-center justify-center text-white text-xs font-medium">
                    6-7AM
                  </div>
                  <div className="col-span-11"></div>
                </div>
                <div className="text-sm text-gray-600">Duration: 1h 0m | Progress: 100%</div>
              </CardContent>
            </Card>

            {/* Task 2 */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Foundation Setup</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      In Progress
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <div></div>
                  <div></div>
                  <div className="bg-blue-400 rounded h-8 flex items-center justify-center text-white text-xs font-medium col-span-4">
                    8AM-12PM (75%)
                  </div>
                  <div className="col-span-6"></div>
                </div>
                <div className="text-sm text-gray-600 mb-3">Duration: 4h 0m | Progress: 75%</div>

                {/* Subtasks */}
                <div className="ml-4 space-y-2 border-l-2 border-gray-200 pl-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Excavation</span>
                    <Badge className="bg-emerald-100 text-emerald-800 text-xs">Complete</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">Concrete Pouring</span>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Task 3 */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Framing Work</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <PlayCircle className="w-3 h-3 mr-1" />
                      In Progress
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <div className="col-span-4"></div>
                  <div className="bg-blue-300 rounded h-8 flex items-center justify-center text-white text-xs font-medium col-span-5">
                    10AM-3PM (40%)
                  </div>
                  <div className="col-span-3"></div>
                </div>
                <div className="text-sm text-gray-600">Duration: 5h 0m | Progress: 40%</div>
              </CardContent>
            </Card>

            {/* Task 4 */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">Electrical Setup</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Started
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-500 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <div className="col-span-7"></div>
                  <div className="bg-gray-300 rounded h-8 flex items-center justify-center text-gray-600 text-xs font-medium col-span-4">
                    1-5PM (0%)
                  </div>
                  <div></div>
                </div>
                <div className="text-sm text-gray-600">Duration: 4h 0m | Progress: 0%</div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="mt-8 bg-white/95 backdrop-blur-sm shadow-xl border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Overall Day Progress</h2>
                <span className="text-3xl font-bold text-blue-600">62%</span>
              </div>
              <Progress value={62} className="h-4" />
              <div className="mt-2 text-sm text-gray-600">5 of 8 tasks completed or in progress</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
