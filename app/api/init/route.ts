import { NextResponse } from "next/server"
import { initializeStorage, saveProject } from "@/lib/storage"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.info("Initializing storage...")

    // Initialize storage
    await initializeStorage()

    // Create default projects if they don't exist
    await saveProject("build", "Build Day")
    await saveProject("destroy", "Destroy Day")

    logger.info("Storage initialized successfully")

    return NextResponse.json({
      success: true,
      message: "Storage initialized successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    const errorMessage = error.message || "Unknown error"
    logger.error("Storage initialization failed", { error: errorMessage })

    return NextResponse.json(
      {
        success: false,
        message: "Storage initialization failed",
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
