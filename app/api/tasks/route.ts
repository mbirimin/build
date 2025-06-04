import { type NextRequest, NextResponse } from "next/server"
import { getTasks, saveTasks } from "@/lib/storage"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectType = searchParams.get("projectType")

    if (!projectType) {
      logger.warn("Tasks GET request missing projectType parameter")
      return NextResponse.json({ error: "Project type is required" }, { status: 400 })
    }

    logger.debug(`Fetching tasks for project: ${projectType}`)

    const tasks = await getTasks(projectType)

    logger.info(`Successfully fetched ${tasks.length} tasks for ${projectType}`)

    return NextResponse.json({
      tasks,
      count: tasks.length,
      projectType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Error fetching tasks", { error: errorMessage })

    return NextResponse.json(
      {
        error: "Failed to fetch tasks",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, tasks } = body

    if (!projectType || !tasks) {
      logger.warn("Tasks POST request missing required fields", { projectType: !!projectType, tasks: !!tasks })
      return NextResponse.json({ error: "Project type and tasks are required" }, { status: 400 })
    }

    if (!Array.isArray(tasks)) {
      logger.warn("Tasks POST request - tasks is not an array")
      return NextResponse.json({ error: "Tasks must be an array" }, { status: 400 })
    }

    logger.debug(`Saving ${tasks.length} tasks for project: ${projectType}`)

    await saveTasks(tasks, projectType)

    logger.info(`Successfully saved ${tasks.length} tasks for ${projectType}`)

    return NextResponse.json({
      success: true,
      count: tasks.length,
      projectType,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    logger.error("Error saving tasks", { error: errorMessage })

    return NextResponse.json(
      {
        error: "Failed to save tasks",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
