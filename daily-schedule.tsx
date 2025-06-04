"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronRight,
  Trash2,
  Plus,
  Clock,
  Target,
  CheckCircle2,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Hammer,
  Wrench,
  Calendar,
  LogOut,
  Timer,
  Lock,
  Unlock,
} from "lucide-react"

interface Task {
  id: string
  title: string
  startTime: string
  endTime: string
  status: "Not Started" | "In Progress" | "Completed" | "On Hold"
  progress: number
  subtasks: Task[]
  isExpanded?: boolean
  completedAt?: string | null
  totalTime?: string | null
  completedBy?: string | null
  locked?: boolean
}

const statusConfig = {
  "Not Started": {
    color: "bg-slate-500",
    icon: AlertCircle,
    textColor: "text-slate-600",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    shadowColor: "shadow-slate-200/50",
  },
  "In Progress": {
    color: "bg-blue-500",
    icon: PlayCircle,
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    shadowColor: "shadow-blue-200/50",
  },
  Completed: {
    color: "bg-emerald-500",
    icon: CheckCircle2,
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    shadowColor: "shadow-emerald-200/50",
  },
  "On Hold": {
    color: "bg-amber-500",
    icon: PauseCircle,
    textColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    shadowColor: "shadow-amber-200/50",
  },
}

// Glass-morphism color schemes for main tasks
const mainTaskColors = [
  {
    accent: "from-blue-400/50 to-blue-500/50",
    border: "border-blue-300/50",
    text: "text-white",
    shadow: "shadow-blue-400/40",
    glow: "shadow-blue-500/30",
    subtaskAccent: "from-blue-300/40 to-blue-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-emerald-400/50 to-emerald-500/50",
    border: "border-emerald-300/50",
    text: "text-white",
    shadow: "shadow-emerald-400/40",
    glow: "shadow-emerald-500/30",
    subtaskAccent: "from-emerald-300/40 to-emerald-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-purple-400/50 to-purple-500/50",
    border: "border-purple-300/50",
    text: "text-white",
    shadow: "shadow-purple-400/40",
    glow: "shadow-purple-500/30",
    subtaskAccent: "from-purple-300/40 to-purple-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-orange-400/50 to-orange-500/50",
    border: "border-orange-300/50",
    text: "text-white",
    shadow: "shadow-orange-400/40",
    glow: "shadow-orange-500/30",
    subtaskAccent: "from-orange-300/40 to-orange-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-cyan-400/50 to-cyan-500/50",
    border: "border-cyan-300/50",
    text: "text-white",
    shadow: "shadow-cyan-400/40",
    glow: "shadow-cyan-500/30",
    subtaskAccent: "from-cyan-300/40 to-cyan-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-pink-400/50 to-pink-500/50",
    border: "border-pink-300/50",
    text: "text-white",
    shadow: "shadow-pink-400/40",
    glow: "shadow-pink-500/30",
    subtaskAccent: "from-pink-300/40 to-pink-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-indigo-400/50 to-indigo-500/50",
    border: "border-indigo-300/50",
    text: "text-white",
    shadow: "shadow-indigo-400/40",
    glow: "shadow-indigo-500/30",
    subtaskAccent: "from-indigo-300/40 to-indigo-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-red-400/50 to-red-500/50",
    border: "border-red-300/50",
    text: "text-white",
    shadow: "shadow-red-400/40",
    glow: "shadow-red-500/30",
    subtaskAccent: "from-red-300/40 to-red-400/40",
    subtaskText: "text-white",
  },
  {
    accent: "from-teal-400/50 to-teal-500/50",
    border: "border-teal-300/50",
    text: "text-white",
    shadow: "shadow-teal-400/40",
    glow: "shadow-teal-500/30",
    subtaskAccent: "from-teal-300/40 to-teal-400/40",
    subtaskText: "text-white",
  },
]

interface DailyScheduleProps {
  onBack: () => void
  onLogout: () => void
  userType?: "admin" | "user"
  projectType: "build" | "destroy"
  currentUser: string
}

export default function DailySchedule({
  onBack,
  onLogout,
  userType = "user",
  projectType,
  currentUser,
}: DailyScheduleProps) {
  const isAdminMode = userType === "admin"
  const projectConfig = {
    build: {
      title: "Build Day",
      icon: Hammer,
      color: "text-emerald-600",
      bgGradient: "from-emerald-500 to-blue-600",
    },
    destroy: {
      title: "Destroy Day",
      icon: Wrench,
      color: "text-red-600",
      bgGradient: "from-red-500 to-orange-600",
    },
  }

  const config = projectConfig[projectType]
  const ProjectIcon = config.icon

  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [showAddTask, setShowAddTask] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>()

  // API Functions
  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/tasks?projectType=${projectType}`)
      const data = await response.json()

      if (response.ok) {
        setTasks(data.tasks || [])
      } else {
        console.error("Failed to fetch tasks:", data.error)
      }
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Debounced save function
  const debouncedSave = useCallback(
    (updatedTasks: Task[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch("/api/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              projectType,
              tasks: updatedTasks,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            console.error("Failed to save tasks:", data.error)
          }
        } catch (error) {
          console.error("Error saving tasks:", error)
        }
      }, 500) // Save after 500ms of no changes
    },
    [projectType],
  )

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [projectType])

  // Auto-save tasks when they change (but not during initial load)
  useEffect(() => {
    if (!isLoading && tasks.length > 0) {
      debouncedSave(tasks)
    }
  }, [tasks, isLoading, debouncedSave])

  // Calculate automatic main task times based on subtasks
  const calculateMainTaskTimes = (task: Task) => {
    if (task.subtasks.length === 0) {
      return { startTime: task.startTime, endTime: task.endTime, totalTime: task.totalTime }
    }

    const subtasksWithTimes = task.subtasks.filter((subtask) => subtask.startTime && subtask.endTime)

    if (subtasksWithTimes.length === 0) {
      return { startTime: task.startTime, endTime: task.endTime, totalTime: task.totalTime }
    }

    // Find earliest start time
    const earliestStart = subtasksWithTimes.reduce((earliest, subtask) => {
      return subtask.startTime < earliest ? subtask.startTime : earliest
    }, subtasksWithTimes[0].startTime)

    // Find latest end time
    const latestEnd = subtasksWithTimes.reduce((latest, subtask) => {
      return subtask.endTime > latest ? subtask.endTime : latest
    }, subtasksWithTimes[0].endTime)

    // Check if all subtasks are completed
    const allSubtasksCompleted = task.subtasks.every((subtask) => subtask.status === "Completed")

    let totalTime = null
    if (allSubtasksCompleted && earliestStart && latestEnd) {
      totalTime = calculateTotalTime(earliestStart, latestEnd)
    }

    return {
      startTime: earliestStart,
      endTime: latestEnd,
      totalTime: totalTime,
    }
  }

  const calculateTaskProgress = (task: Task) => {
    if (task.subtasks.length === 0) {
      return { progress: task.progress, status: task.status }
    }

    const totalSubtasks = task.subtasks.length
    const completedSubtasks = task.subtasks.filter((subtask) => subtask.status === "Completed").length
    const inProgressSubtasks = task.subtasks.filter((subtask) => subtask.status === "In Progress").length

    const progress = Math.round((completedSubtasks * 100 + inProgressSubtasks * 50) / totalSubtasks)

    let status = task.status
    if (completedSubtasks === totalSubtasks) {
      status = "Completed"
    } else if (completedSubtasks > 0 || inProgressSubtasks > 0) {
      status = "In Progress"
    } else {
      status = "Not Started"
    }

    return { progress, status }
  }

  const calculateTotalTime = (startTime: string, endTime: string): string => {
    if (!startTime || !endTime) return ""

    const [startHour, startMin] = startTime.split(":").map(Number)
    const [endHour, endMin] = endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    const totalMinutes = endMinutes - startMinutes

    if (totalMinutes <= 0) return ""

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const calculateStats = () => {
    const allTasks = tasks.reduce((acc, task) => {
      const taskWithProgress = { ...task, ...calculateTaskProgress(task) }
      acc.push(taskWithProgress)
      acc.push(...task.subtasks)
      return acc
    }, [] as Task[])

    const total = allTasks.length
    const completed = allTasks.filter((task) => task.status === "Completed").length
    const inProgress = allTasks.filter((task) => task.status === "In Progress").length
    const remaining = total - completed

    const overallProgress = total > 0 ? Math.round((completed * 100 + inProgress * 50) / total) : 0

    return { total, completed, inProgress, remaining, overallProgress }
  }

  const toggleExpanded = useCallback((taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task)),
    )
  }, [])

  const toggleLocked = useCallback(
    (taskId: string, parentId?: string) => {
      if (!isAdminMode) return

      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (parentId && task.id === parentId) {
            return {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === taskId ? { ...subtask, locked: !subtask.locked } : subtask,
              ),
            }
          }
          if (task.id === taskId) {
            return { ...task, locked: !task.locked }
          }
          return task
        })
      })
    },
    [isAdminMode],
  )

  const updateTask = useCallback(
    (taskId: string, field: keyof Task, value: any, parentId?: string) => {
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (parentId && task.id === parentId) {
            const updatedTask = {
              ...task,
              subtasks: task.subtasks.map((subtask) => {
                if (subtask.id === taskId) {
                  const updatedSubtask = { ...subtask }

                  // Handle status changes and time tracking for subtasks
                  if (field === "status") {
                    if (value === "Completed" && subtask.status !== "Completed") {
                      updatedSubtask.completedAt = new Date().toISOString()
                      updatedSubtask.totalTime = calculateTotalTime(subtask.startTime, subtask.endTime)
                      updatedSubtask.progress = 100
                      updatedSubtask.completedBy = currentUser
                    } else if (value !== "Completed") {
                      updatedSubtask.completedAt = null
                      updatedSubtask.totalTime = null
                      updatedSubtask.completedBy = null
                      if (value === "In Progress") {
                        updatedSubtask.progress = 50
                      } else {
                        updatedSubtask.progress = 0
                      }
                    }
                  }

                  updatedSubtask[field] = value
                  return updatedSubtask
                }
                return subtask
              }),
            }

            // Update main task times based on subtasks
            const mainTaskTimes = calculateMainTaskTimes(updatedTask)
            updatedTask.startTime = mainTaskTimes.startTime
            updatedTask.endTime = mainTaskTimes.endTime
            updatedTask.totalTime = mainTaskTimes.totalTime

            // Update main task status if all subtasks are completed
            const { status: calculatedStatus } = calculateTaskProgress(updatedTask)
            if (calculatedStatus === "Completed" && updatedTask.status !== "Completed") {
              updatedTask.status = "Completed"
              updatedTask.completedAt = new Date().toISOString()
              updatedTask.progress = 100
            } else if (calculatedStatus !== "Completed") {
              updatedTask.completedAt = null
              if (calculatedStatus === "In Progress") {
                updatedTask.status = "In Progress"
                updatedTask.progress = 50
              } else {
                updatedTask.status = "Not Started"
                updatedTask.progress = 0
              }
            }

            return updatedTask
          }
          if (task.id === taskId) {
            const updatedTask = { ...task }

            // Handle status changes and time tracking for main tasks (only if no subtasks)
            if (field === "status" && task.subtasks.length === 0) {
              if (value === "Completed" && task.status !== "Completed") {
                updatedTask.completedAt = new Date().toISOString()
                updatedTask.totalTime = calculateTotalTime(task.startTime, task.endTime)
                updatedTask.progress = 100
                updatedTask.completedBy = currentUser
              } else if (value !== "Completed") {
                updatedTask.completedAt = null
                updatedTask.totalTime = null
                updatedTask.completedBy = null
                if (value === "In Progress") {
                  updatedTask.progress = 50
                } else {
                  updatedTask.progress = 0
                }
              }
            }

            updatedTask[field] = value
            return updatedTask
          }
          return task
        })
      })
    },
    [currentUser],
  )

  const addMainTask = useCallback(() => {
    if (!isAdminMode) return

    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle,
        startTime: "",
        endTime: "",
        status: "Not Started",
        progress: 0,
        subtasks: [],
        isExpanded: true,
        completedAt: null,
        totalTime: null,
        completedBy: null,
        locked: false,
      }
      setTasks((prevTasks) => [...prevTasks, newTask])
      setNewTaskTitle("")
      setShowAddTask(false)
    }
  }, [isAdminMode, newTaskTitle])

  const addSubtask = useCallback(
    (parentId: string) => {
      if (!isAdminMode) return

      const newSubtask: Task = {
        id: `subtask-${Date.now()}`,
        title: "New Subtask",
        startTime: "",
        endTime: "",
        status: "Not Started",
        progress: 0,
        subtasks: [],
        completedAt: null,
        totalTime: null,
        completedBy: null,
        locked: false,
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === parentId ? { ...task, subtasks: [...task.subtasks, newSubtask] } : task)),
      )
    },
    [isAdminMode],
  )

  const deleteTask = useCallback(
    (taskId: string, parentId?: string) => {
      if (!isAdminMode) return

      setTasks((prevTasks) => {
        if (parentId) {
          return prevTasks.map((task) =>
            task.id === parentId
              ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== taskId) }
              : task,
          )
        } else {
          return prevTasks.filter((task) => task.id !== taskId)
        }
      })
    },
    [isAdminMode],
  )

  const TaskCard = ({
    task,
    parentId,
    level = 0,
    colorIndex = 0,
  }: {
    task: Task
    parentId?: string
    level?: number
    colorIndex?: number
  }) => {
    const isMainTask = level === 0
    const { progress, status } = isMainTask
      ? calculateTaskProgress(task)
      : { progress: task.progress, status: task.status }
    const config = statusConfig[status]
    const StatusIcon = config.icon
    const colors = mainTaskColors[colorIndex % mainTaskColors.length]
    const isEditing = editingTaskId === task.id
    const isLocked = task.locked && !isAdminMode

    // For main tasks with subtasks, use calculated times
    const displayTask = isMainTask && task.subtasks.length > 0 ? { ...task, ...calculateMainTaskTimes(task) } : task

    const handleTitleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isLocked) return
        updateTask(task.id, "title", e.target.value, parentId)
      },
      [task.id, parentId, updateTask, isLocked],
    )

    const handleTitleFocus = useCallback(() => {
      if (isLocked) return
      setEditingTaskId(task.id)
    }, [task.id, isLocked])

    const handleTitleBlur = useCallback(() => {
      setEditingTaskId(null)
    }, [])

    return (
      <div className={`${isMainTask ? "mb-3 md:mb-4" : "mb-2"} ${level > 0 ? "ml-4 md:ml-6" : ""}`}>
        <Card
          className={`transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${
            isMainTask
              ? `bg-black/30 border border-white/20 shadow-lg hover:shadow-2xl backdrop-blur-md`
              : `bg-black/15 border border-white/10 shadow-md hover:shadow-lg backdrop-blur-md`
          } rounded-xl overflow-hidden ${task.locked ? "ring-2 ring-yellow-400/50" : ""}`}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              isMainTask ? colors.accent : colors.subtaskAccent
            } rounded-xl backdrop-blur-md`}
          ></div>
          <CardContent className="p-3 md:p-4 relative z-10">
            {/* Mobile Layout */}
            <div className="block md:hidden space-y-3">
              {/* Title Row */}
              <div className="flex items-center gap-2">
                {task.subtasks.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleExpanded(task.id)}
                    className={`p-2 h-8 w-8 hover:bg-white/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0`}
                  >
                    {task.isExpanded ? (
                      <ChevronDown className={`w-4 h-4 ${isMainTask ? "text-white" : "text-white"}`} />
                    ) : (
                      <ChevronRight className={`w-4 h-4 ${isMainTask ? "text-white" : "text-white"}`} />
                    )}
                  </Button>
                )}

                <div className="flex-1 min-w-0">
                  {isAdminMode ? (
                    <input
                      type="text"
                      value={task.title}
                      onChange={handleTitleChange}
                      onFocus={handleTitleFocus}
                      onBlur={handleTitleBlur}
                      disabled={isLocked}
                      className={`border-none p-2 h-auto bg-transparent outline-none ${
                        isMainTask
                          ? `text-base md:text-lg font-bold text-white placeholder-white/70`
                          : `text-sm md:text-base font-semibold text-white placeholder-white/70`
                      } focus:ring-2 focus:ring-white/50 rounded w-full ${
                        isEditing ? "bg-white/20 shadow-sm" : ""
                      } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                    />
                  ) : (
                    <h3
                      className={`${
                        isMainTask
                          ? `text-base md:text-lg font-bold text-white`
                          : `text-sm md:text-base font-semibold text-white`
                      } ${isLocked ? "opacity-60" : ""} truncate`}
                    >
                      {task.title}
                    </h3>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Lock indicator */}
                  {task.locked && (
                    <div className="p-1.5 bg-yellow-500/80 rounded-full shadow-sm">
                      <Lock className="w-3 h-3 text-white" />
                    </div>
                  )}

                  {/* Admin controls */}
                  {isAdminMode && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLocked(task.id, parentId)}
                        className="p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        {task.locked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task.id, parentId)}
                        className="p-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Time Row - Only show for subtasks */}
              {!isMainTask && (
                <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2 shadow-inner backdrop-blur-sm">
                  <Input
                    type="time"
                    value={displayTask.startTime}
                    onChange={(e) => updateTask(task.id, "startTime", e.target.value, parentId)}
                    className="flex-1 h-8 text-sm border-white/30 shadow-sm bg-white/80 text-gray-800"
                    disabled={!isAdminMode || isLocked}
                  />
                  <span className="text-xs font-medium text-black flex-shrink-0">to</span>
                  <Input
                    type="time"
                    value={displayTask.endTime}
                    onChange={(e) => updateTask(task.id, "endTime", e.target.value, parentId)}
                    className="flex-1 h-8 text-sm border-white/30 shadow-sm bg-white/80 text-gray-800"
                    disabled={!isAdminMode || isLocked}
                  />
                </div>
              )}

              {/* Status and Time Display Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className={`p-1.5 rounded-full bg-white/20 shadow-sm backdrop-blur-sm flex-shrink-0`}>
                    <StatusIcon className={`w-4 h-4 text-white`} />
                  </div>
                  <Select
                    value={status}
                    onValueChange={(value) => updateTask(task.id, "status", value as Task["status"], parentId)}
                    disabled={(isMainTask && task.subtasks.length > 0) || isLocked}
                  >
                    <SelectTrigger className="w-full sm:w-32 h-8 text-xs shadow-sm border-white/30 bg-white/80 text-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Total Time Display */}
                  {status === "Completed" && displayTask.totalTime && (
                    <div className="flex items-center gap-1 bg-emerald-500/80 text-white px-2 py-1 rounded-lg shadow-sm border border-emerald-400/50 backdrop-blur-sm">
                      <Timer className="w-3 h-3" />
                      <span className="text-xs font-semibold">{displayTask.totalTime}</span>
                    </div>
                  )}

                  {/* Completed By Display */}
                  {status === "Completed" && task.completedBy && (
                    <div className="flex items-center gap-1 bg-blue-500/80 text-white px-2 py-1 rounded-lg shadow-sm border border-blue-400/50 backdrop-blur-sm">
                      <span className="text-xs font-semibold">by {task.completedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {task.subtasks.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(task.id)}
                      className={`p-2 h-8 w-8 hover:bg-white/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200 flex-shrink-0`}
                    >
                      {task.isExpanded ? (
                        <ChevronDown className={`w-4 h-4 text-white`} />
                      ) : (
                        <ChevronRight className={`w-4 h-4 text-white`} />
                      )}
                    </Button>
                  )}

                  <div className="flex-1 min-w-0">
                    {isAdminMode ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={handleTitleChange}
                        onFocus={handleTitleFocus}
                        onBlur={handleTitleBlur}
                        disabled={isLocked}
                        className={`border-none p-2 h-auto bg-transparent outline-none ${
                          isMainTask
                            ? `text-lg font-bold text-white placeholder-white/70`
                            : `text-base font-semibold text-white placeholder-white/70`
                        } focus:ring-2 focus:ring-white/50 rounded w-full ${
                          isEditing ? "bg-white/20 shadow-sm" : ""
                        } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                        style={{ minWidth: "200px" }}
                      />
                    ) : (
                      <h3
                        className={`${
                          isMainTask ? `text-lg font-bold text-white` : `text-base font-semibold text-white`
                        } ${isLocked ? "opacity-60" : ""} truncate`}
                      >
                        {task.title}
                      </h3>
                    )}
                  </div>

                  {/* Time Inputs - Only show for subtasks */}
                  {!isMainTask && (
                    <div className="flex items-center gap-3 bg-white/20 rounded-lg p-1 shadow-inner backdrop-blur-sm flex-shrink-0">
                      <Input
                        type="time"
                        value={displayTask.startTime}
                        onChange={(e) => updateTask(task.id, "startTime", e.target.value, parentId)}
                        className="w-24 h-9 text-sm border-white/30 shadow-sm bg-white/80 text-gray-800"
                        disabled={!isAdminMode || isLocked}
                      />
                      <span className="text-sm font-medium text-black">to</span>
                      <Input
                        type="time"
                        value={displayTask.endTime}
                        onChange={(e) => updateTask(task.id, "endTime", e.target.value, parentId)}
                        className="w-24 h-9 text-sm border-white/30 shadow-sm bg-white/80 text-gray-800"
                        disabled={!isAdminMode || isLocked}
                      />
                    </div>
                  )}

                  {/* Total Time Display */}
                  {status === "Completed" && displayTask.totalTime && (
                    <div className="flex items-center gap-2 bg-emerald-500/80 text-white px-3 py-2 rounded-lg shadow-sm border border-emerald-400/50 backdrop-blur-sm flex-shrink-0">
                      <Timer className="w-4 h-4" />
                      <span className="text-sm font-semibold">{displayTask.totalTime}</span>
                    </div>
                  )}

                  {/* Completed By Display */}
                  {status === "Completed" && task.completedBy && (
                    <div className="flex items-center gap-2 bg-blue-500/80 text-white px-3 py-2 rounded-lg shadow-sm border border-blue-400/50 backdrop-blur-sm flex-shrink-0">
                      <span className="text-sm font-semibold">by {task.completedBy}</span>
                    </div>
                  )}

                  {/* Lock indicator */}
                  {task.locked && (
                    <div className="p-2 bg-yellow-500/80 rounded-full shadow-sm flex-shrink-0">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`p-2 rounded-full bg-white/20 shadow-sm backdrop-blur-sm`}>
                      <StatusIcon className={`w-5 h-5 text-white`} />
                    </div>
                    <Select
                      value={status}
                      onValueChange={(value) => updateTask(task.id, "status", value as Task["status"], parentId)}
                      disabled={(isMainTask && task.subtasks.length > 0) || isLocked}
                    >
                      <SelectTrigger className="w-36 h-10 text-sm shadow-sm border-white/30 bg-white/80 text-gray-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isAdminMode && (
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleLocked(task.id, parentId)}
                      className="p-2 text-yellow-300 hover:text-yellow-100 hover:bg-yellow-500/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      {task.locked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id, parentId)}
                      className="p-2 text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar - Only for main tasks */}
            {isMainTask && (
              <div className="mb-4 bg-white/20 rounded-lg p-2 shadow-inner backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-semibold">Progress</span>
                  <span className="text-sm font-bold text-white bg-white/20 px-2 py-1 rounded shadow-sm backdrop-blur-sm">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-3 md:h-4 shadow-sm" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subtasks */}
        {task.isExpanded &&
          task.subtasks.map((subtask) => (
            <TaskCard key={subtask.id} task={subtask} parentId={task.id} level={level + 1} colorIndex={colorIndex} />
          ))}

        {/* Add Subtask Button */}
        {task.isExpanded && isMainTask && isAdminMode && (
          <div className="ml-4 md:ml-6 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addSubtask(task.id)}
              className="border-dashed border-2 border-white/50 hover:border-solid transition-all h-8 md:h-10 px-3 md:px-4 text-xs md:text-sm hover:bg-white/20 shadow-sm hover:shadow-md text-black backdrop-blur-sm"
            >
              <Plus className="w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
              Add Subtask
            </Button>
          </div>
        )}
      </div>
    )
  }

  const stats = calculateStats()

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url(/ldc5.jpg)",
          backgroundSize: "contain",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="text-center relative z-10 px-4">
          <div className="animate-spin rounded-full h-24 md:h-32 w-24 md:w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg md:text-xl text-white">Loading schedule...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: "url(/ldc5.jpg)",
        backgroundSize: "contain",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10">
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.bgGradient} text-white shadow-2xl`}>
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/20 p-2 md:p-3 shadow-lg">
                  <ArrowLeft className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Back to Projects</span>
                  <span className="sm:hidden">Back</span>
                </Button>
                <div className="p-2 md:p-3 bg-white/20 rounded-xl shadow-lg backdrop-blur-sm">
                  <ProjectIcon className="w-6 md:w-8 h-6 md:h-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-bold drop-shadow-lg">{config.title}</h1>
                  <p className="text-white/90 text-xs md:text-sm mt-1 flex items-center gap-1 md:gap-2">
                    <Calendar className="w-3 md:w-4 h-3 md:h-4" />
                    <span className="hidden sm:inline">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="sm:hidden">
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-white hover:bg-white/20 bg-red-600/80 hover:bg-red-700/80 px-3 md:px-6 py-2 md:py-3 font-semibold shadow-lg text-sm md:text-base"
              >
                <LogOut className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-2xl md:text-4xl font-bold text-slate-700 mb-1 md:mb-2 drop-shadow-sm">
                  {stats.total}
                </div>
                <div className="text-xs md:text-sm text-slate-600 font-semibold">Total Tasks</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-2xl md:text-4xl font-bold text-emerald-700 mb-1 md:mb-2 drop-shadow-sm">
                  {stats.completed}
                </div>
                <div className="text-xs md:text-sm text-emerald-600 font-semibold">Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-2xl md:text-4xl font-bold text-blue-700 mb-1 md:mb-2 drop-shadow-sm">
                  {stats.inProgress}
                </div>
                <div className="text-xs md:text-sm text-blue-600 font-semibold">In Progress</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-3 md:p-4 text-center">
                <div className="text-2xl md:text-4xl font-bold text-amber-700 mb-1 md:mb-2 drop-shadow-sm">
                  {stats.remaining}
                </div>
                <div className="text-xs md:text-sm text-amber-600 font-semibold">Remaining</div>
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-300 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2 md:gap-3">
                  <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-indigo-600" />
                  <span className="hidden sm:inline">Overall Progress</span>
                  <span className="sm:hidden">Progress</span>
                </h3>
                <Badge className="bg-indigo-600 text-white px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-bold shadow-lg">
                  {stats.overallProgress}%
                </Badge>
              </div>
              <Progress value={stats.overallProgress} className="h-4 md:h-6 shadow-inner" />
            </CardContent>
          </Card>

          {/* Tasks */}
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-3xl font-bold text-white flex items-center gap-2 md:gap-3 drop-shadow-lg">
                <Target className="w-6 md:w-8 h-6 md:h-8 text-blue-400" />
                <span className="hidden sm:inline">Schedule of Works</span>
                <span className="sm:hidden">Schedule</span>
              </h2>
              {isAdminMode && (
                <Button
                  onClick={() => setShowAddTask(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 px-3 md:px-6 py-2 md:py-3 text-sm md:text-base"
                >
                  <Plus className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Add New Task</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              )}
            </div>

            {showAddTask && isAdminMode && (
              <Card className="border-dashed border-3 border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
                <CardContent className="p-3 md:p-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                    <Input
                      placeholder="Enter new task title..."
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addMainTask()}
                      className="flex-1 h-10 md:h-12 text-base md:text-lg shadow-sm border-blue-200"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={addMainTask}
                        className="bg-blue-600 hover:bg-blue-700 h-10 md:h-12 px-4 md:px-6 shadow-lg flex-1 sm:flex-none"
                      >
                        Add Task
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowAddTask(false)}
                        className="h-10 md:h-12 px-4 md:px-6 shadow-lg flex-1 sm:flex-none"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} colorIndex={index} />
            ))}

            {tasks.length === 0 && (
              <Card className="border-dashed border-3 border-gray-400 shadow-xl">
                <CardContent className="p-6 md:p-8 text-center">
                  <div className="w-16 md:w-20 h-16 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-lg">
                    <Clock className="w-8 md:w-10 h-8 md:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-600 mb-2 md:mb-3">No tasks scheduled</h3>
                  <p className="text-gray-500 mb-4 md:mb-6 text-base md:text-lg">
                    {isAdminMode
                      ? "Add your first task to get started with your schedule of works!"
                      : "No tasks have been added by the administrator yet."}
                  </p>
                  {isAdminMode && (
                    <Button
                      onClick={() => setShowAddTask(true)}
                      className="bg-blue-600 hover:bg-blue-700 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg shadow-xl"
                    >
                      <Plus className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                      Create First Task
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
