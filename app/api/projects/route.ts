import { type NextRequest, NextResponse } from "next/server"
import { getProjects, saveProject } from "@/lib/file-storage"

export async function GET(request: NextRequest) {
  try {
    const projects = await getProjects()
    return NextResponse.json({ projects })
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

    // Update project in file storage
    await saveProject(projectType, title, date)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}
