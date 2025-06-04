"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Target,
  CheckCircle2,
  PlayCircle,
  ArrowLeft,
  Hammer,
  Calendar,
  LogOut,
  Timer,
} from "lucide-react"

export default function DesignOption1() {
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["task-1"])

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => (prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]))
  }

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
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button className="text-white hover:text-blue-200 flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Projects
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Hammer className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Build Day</h1>
                  <p className="text-blue-100 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Sunday, June 1, 2025
                  </p>
                </div>
              </div>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">8</div>
                <div className="text-gray-600 font-medium">Total Tasks</div>
              </CardContent>
            </Card>
            <Card className="bg-emerald-50/95 backdrop-blur-sm border border-emerald-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">3</div>
                <div className="text-emerald-700 font-medium">Completed</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50/95 backdrop-blur-sm border border-blue-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
                <div className="text-blue-700 font-medium">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-orange-50/95 backdrop-blur-sm border border-orange-200 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">1</div>
                <div className="text-orange-700 font-medium">Remaining</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl mb-6 border-0">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Overall Progress
                </h2>
                <Badge className="bg-blue-600 text-white px-4 py-2 text-lg font-bold">62%</Badge>
              </div>
              <Progress value={62} className="h-4" />
            </CardContent>
          </Card>

          {/* Tasks */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">Schedule of Works</h2>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add New Task
              </Button>
            </div>

            {/* Main Task Card */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 border-l-4 border-blue-500">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" onClick={() => toggleTask("task-1")} className="p-2 h-8 w-8">
                        {expandedTasks.includes("task-1") ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </Button>
                      <h3 className="text-lg font-semibold text-gray-800">Foundation Setup</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <PlayCircle className="w-3 h-3 mr-1" />
                        In Progress
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-2">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Start Time</label>
                      <Input type="time" className="mt-1" defaultValue="08:00" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">End Time</label>
                      <Input type="time" className="mt-1" defaultValue="12:00" />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 font-medium">Duration</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-lg text-gray-700 flex items-center gap-2">
                        <Timer className="w-4 h-4" />
                        4h 0m
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold text-blue-600">75%</span>
                    </div>
                    <Progress value={75} className="h-3" />
                  </div>

                  {/* Subtasks */}
                  {expandedTasks.includes("task-1") && (
                    <div className="space-y-3 pl-4 border-l-2 border-gray-200 ml-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Excavation</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Complete
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-red-500 p-1">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Concrete Pouring</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                              <PlayCircle className="w-3 h-3 mr-1" />
                              In Progress
                            </Badge>
                            <Button variant="ghost" size="sm" className="text-red-500 p-1">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-dashed">
                        <Plus className="w-3 h-3 mr-2" />
                        Add Subtask
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Another Task */}
            <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
              <CardContent className="p-6 border-l-4 border-emerald-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Site Preparation</h3>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="text-sm text-gray-600">Start: 07:00</label>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">End: 08:00</label>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <Timer className="w-4 h-4" />
                    1h 0m
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
