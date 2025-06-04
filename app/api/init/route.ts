import { NextResponse } from "next/server"
import { initializeStorage, saveProject } from "@/lib/file-storage"

// This endpoint initializes the storage and creates default projects
export async function GET() {
  try {
    // Initialize storage
    await initializeStorage()

    // Create default projects if they don't exist
    await saveProject("build", "Build Day")
    await saveProject("destroy", "Destroy Day")

    return NextResponse.json({
      success: true,
      message: "Storage initialized successfully",
    })
  } catch (error: any) {
    console.error("Storage initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Storage initialization failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
