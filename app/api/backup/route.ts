import { NextResponse } from "next/server"
import { cleanupBackups } from "@/lib/storage"
import { logger } from "@/lib/logger"

export async function POST() {
  try {
    logger.info("Starting backup cleanup")

    await cleanupBackups(7) // Keep 7 days of backups

    logger.info("Backup cleanup completed")

    return NextResponse.json({
      success: true,
      message: "Backup cleanup completed",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Backup cleanup failed", { error: errorMessage })

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
