import { NextResponse } from "next/server"
import { healthCheck } from "@/lib/storage"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    const health = await healthCheck()

    logger.info("Health check performed", health)

    if (health.status === "healthy") {
      return NextResponse.json(health)
    } else {
      return NextResponse.json(health, { status: 503 })
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Health check failed", { error: errorMessage })

    return NextResponse.json(
      {
        status: "unhealthy",
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}
