import { type NextRequest, NextResponse } from "next/server"
import { getTasks, saveTasks } from "@/lib/file-storage"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectType = searchParams.get("projectType")

    if (!projectType) {
      return NextResponse.json({ error: "Project type is required" }, { status: 400 })
    }

    console.log(`Fetching tasks for project: ${projectType}`)

    // Fetch tasks from file storage
    const tasks = await getTasks(projectType)

    console.log(`Found ${tasks.length} tasks for ${projectType}`)

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, tasks } = body

    if (!projectType || !tasks) {
      return NextResponse.json({ error: "Project type and tasks are required" }, { status: 400 })
    }

    console.log(`Saving ${tasks.length} tasks for project: ${projectType}`)

    // Save tasks to file storage
    await saveTasks(tasks, projectType)

    console.log(`Successfully saved tasks for ${projectType}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving tasks:", error)
    return NextResponse.json({ error: "Failed to save tasks" }, { status: 500 })
  }
}
