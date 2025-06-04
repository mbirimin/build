import { NextResponse } from "next/server"
import { getTasks, getProjects } from "@/lib/db"

// Debug endpoint to check DynamoDB connection and data
export async function GET() {
  try {
    console.log("Debug endpoint called")

    // Check ALL environment variables
    const allEnvVars = {
      // New variable names (without AWS_ prefix)
      ACCESS_KEY_ID: process.env.ACCESS_KEY_ID || "NOT_SET",
      SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? "SET (hidden)" : "NOT_SET",
      REGION: process.env.REGION || "NOT_SET",
      TASKS_TABLE: process.env.TASKS_TABLE || "NOT_SET",
      PROJECTS_TABLE: process.env.PROJECTS_TABLE || "NOT_SET",

      // Old variable names (for comparison)
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "NOT_SET",
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? "SET (hidden)" : "NOT_SET",
      DYNAMODB_TASKS_TABLE: process.env.DYNAMODB_TASKS_TABLE || "NOT_SET",
      DYNAMODB_PROJECTS_TABLE: process.env.DYNAMODB_PROJECTS_TABLE || "NOT_SET",

      // System variables
      NODE_ENV: process.env.NODE_ENV || "NOT_SET",
      VERCEL: process.env.VERCEL || "NOT_SET",
      VERCEL_ENV: process.env.VERCEL_ENV || "NOT_SET",
    }

    console.log("All environment variables:", allEnvVars)

    // List all environment variable keys that start with certain prefixes
    const envKeys = Object.keys(process.env).filter(
      (key) =>
        key.startsWith("ACCESS_") ||
        key.startsWith("SECRET_") ||
        key.startsWith("REGION") ||
        key.startsWith("TASKS_") ||
        key.startsWith("PROJECTS_") ||
        key.startsWith("AWS_") ||
        key.startsWith("DYNAMODB_"),
    )

    console.log("Relevant env keys found:", envKeys)

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
      environment: allEnvVars,
      availableEnvKeys: envKeys,
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
        environment: {
          ACCESS_KEY_ID: process.env.ACCESS_KEY_ID || "NOT_SET",
          SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY ? "SET (hidden)" : "NOT_SET",
          REGION: process.env.REGION || "NOT_SET",
          TASKS_TABLE: process.env.TASKS_TABLE || "NOT_SET",
          PROJECTS_TABLE: process.env.PROJECTS_TABLE || "NOT_SET",
        },
      },
      { status: 500 },
    )
  }
}
