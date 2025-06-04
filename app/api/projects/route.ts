import { type NextRequest, NextResponse } from "next/server"

// Simple in-memory storage for projects
const projectsStorage: any = {
  build: { title: "Build Day", date: "2025-07-10" },
  destroy: { title: "Destroy Day", date: "2025-07-13" },
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ projects: projectsStorage })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectType, title, date } = body

    if (!projectType) {
      return NextResponse.json({ error: "Project type is required" }, { status: 400 })
    }

    // Update project in memory
    if (!projectsStorage[projectType]) {
      projectsStorage[projectType] = {}
    }

    if (title) projectsStorage[projectType].title = title
    if (date) projectsStorage[projectType].date = date

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}
