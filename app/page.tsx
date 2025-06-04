"use client"

import { useState } from "react"
import LandingPage from "../landing-page"
import LoginPage from "../login-page"
import ProjectSelection from "../project-selection"
import DailySchedule from "../daily-schedule"

type Page = "landing" | "login" | "projects" | "build" | "destroy"
type UserType = "admin" | "user" | null

export default function Page() {
  const [currentPage, setCurrentPage] = useState<Page>("landing")
  const [userType, setUserType] = useState<UserType>(null)
  const [currentUser, setCurrentUser] = useState<string>("")

  const handleLogin = () => {
    setCurrentPage("login")
  }

  const handleLoginSuccess = (loginUserType: "admin" | "user") => {
    setUserType(loginUserType)
    setCurrentUser(loginUserType) // For demo, using userType as username
    setCurrentPage("projects")
  }

  const handleSelectProject = (project: "build" | "destroy") => {
    setCurrentPage(project)
  }

  const handleLogout = () => {
    setCurrentPage("landing")
    setUserType(null)
    setCurrentUser("")
  }

  const handleBack = () => {
    if (currentPage === "login") {
      setCurrentPage("landing")
    } else if (currentPage === "projects") {
      setCurrentPage("landing")
      setUserType(null)
      setCurrentUser("")
    } else if (currentPage === "build" || currentPage === "destroy") {
      setCurrentPage("projects")
    }
  }

  if (currentPage === "landing") {
    return <LandingPage onLogin={handleLogin} />
  }

  if (currentPage === "login") {
    return <LoginPage onBack={handleBack} onLogin={handleLoginSuccess} />
  }

  if (currentPage === "projects") {
    return (
      <ProjectSelection
        onSelectProject={handleSelectProject}
        isAdminMode={userType === "admin"}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
    )
  }

  if (currentPage === "build") {
    return (
      <DailySchedule
        onBack={handleBack}
        onLogout={handleLogout}
        userType={userType || "user"}
        projectType="build"
        currentUser={currentUser}
      />
    )
  }

  if (currentPage === "destroy") {
    return (
      <DailySchedule
        onBack={handleBack}
        onLogout={handleLogout}
        userType={userType || "user"}
        projectType="destroy"
        currentUser={currentUser}
      />
    )
  }

  return null
}
