import { type NextRequest, NextResponse } from "next/server"
import { getProjects, saveProject } from "@/lib/storage"
import { logger } from "@/lib/logger"

export async function GET() {
  try {
    logger.debug("Fetching all projects")

    const projects = await getProjects()

    logger.info(`Successfully fetched ${projects.length} projects`)

    return NextResponse.json({
      projects,
      count: projects.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Error fetching projects", { error: errorMessage })

    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, title, date } = body

    if (!projectType) {
      logger.warn("Projects POST request missing projectType")
      return NextResponse.json({ error: "Project type is required" }, { status: 400 })
    }

    logger.debug(`Updating project: ${projectType}`, { title, date })

    await saveProject(projectType, title, date)

    logger.info(`Successfully updated project: ${projectType}`)

    return NextResponse.json({
      success: true,
      projectType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Error updating project", { error: errorMessage })

    return NextResponse.json(
      {
        error: "Failed to update project",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
