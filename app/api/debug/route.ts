import { NextResponse } from "next/server"
import { getTasks, getProjects } from "@/lib/db"

// Debug endpoint to check DynamoDB connection and data
export async function GET() {
  try {
    console.log("Debug endpoint called")

    // Check environment variables
    const envVars = {
      REGION: process.env.REGION || "NOT_SET",
      DYNAMODB_TASKS_TABLE: process.env.DYNAMODB_TASKS_TABLE || "NOT_SET",
      DYNAMODB_PROJECTS_TABLE: process.env.DYNAMODB_PROJECTS_TABLE || "NOT_SET",
      NODE_ENV: process.env.NODE_ENV || "NOT_SET",
    }

    console.log("Environment variables:", envVars)

    // Try to fetch data from DynamoDB
    let tasksData = []
    let projectsData = []
    let dbError = null

    try {
      // Test fetching tasks for both project types
      const buildTasks = await getTasks("build")
      const destroyTasks = await getTasks("destroy")
      tasksData = { build: buildTasks, destroy: destroyTasks }

      // Test fetching projects
      projectsData = await getProjects()

      console.log("Successfully connected to DynamoDB")
      console.log("Tasks found:", tasksData)
      console.log("Projects found:", projectsData)
    } catch (error: any) {
      dbError = error.message
      console.error("DynamoDB connection failed:", error)
    }

    return NextResponse.json({
      success: !dbError,
      message: dbError ? "DynamoDB connection failed" : "DynamoDB connection successful",
      environment: envVars,
      data: {
        tasks: tasksData,
        projects: projectsData,
      },
      error: dbError,
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
