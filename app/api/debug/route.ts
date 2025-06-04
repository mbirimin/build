import { NextResponse } from "next/server"
import { getTasks, getProjects } from "@/lib/file-storage"
import fs from "fs/promises"
import path from "path"

// Debug endpoint to check file storage
export async function GET() {
  try {
    console.log("Debug endpoint called")

    // Check data directory
    const dataDir = path.join(process.cwd(), "data")
    let dirExists = false
    let files = []

    try {
      await fs.access(dataDir)
      dirExists = true
      files = await fs.readdir(dataDir)
    } catch (error) {
      console.error("Data directory not accessible:", error)
    }

    // Try to fetch data from file storage
    let tasksData = []
    let projectsData = []
    let storageError = null

    try {
      // Test fetching tasks for both project types
      const buildTasks = await getTasks("build")
      const destroyTasks = await getTasks("destroy")
      tasksData = { build: buildTasks, destroy: destroyTasks }

      // Test fetching projects
      projectsData = await getProjects()

      console.log("Successfully accessed file storage")
      console.log("Tasks found:", tasksData)
      console.log("Projects found:", projectsData)
    } catch (error: any) {
      storageError = error.message
      console.error("File storage access failed:", error)
    }

    return NextResponse.json({
      success: !storageError,
      message: storageError ? "File storage access failed" : "File storage access successful",
      storage: {
        dataDir,
        dirExists,
        files,
      },
      data: {
        tasks: tasksData,
        projects: projectsData,
      },
      error: storageError,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Debug check failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
