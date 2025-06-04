import { NextResponse } from "next/server"
import { initializeDatabase, saveProject } from "@/lib/db"

// This endpoint initializes the database and creates default projects
export async function GET() {
  try {
    // Initialize database tables
    await initializeDatabase()

    // Create default projects if they don't exist
    await saveProject("build", "Build Day")
    await saveProject("destroy", "Destroy Day")

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      env: {
        dbHost: process.env.DB_HOST ? "Set" : "Not set",
        dbPort: process.env.DB_PORT ? "Set" : "Not set",
        dbUser: process.env.DB_USER ? "Set" : "Not set",
        dbPassword: process.env.DB_PASSWORD ? "Set" : "Not set",
        dbName: process.env.DB_NAME ? "Set" : "Not set",
      },
    })
  } catch (error: any) {
    console.error("Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database initialization failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
