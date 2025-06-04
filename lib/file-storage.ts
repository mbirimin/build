import fs from "fs/promises"
import path from "path"

// Define paths for data storage
const DATA_DIR = path.join(process.cwd(), "data")
const TASKS_FILE = path.join(DATA_DIR, "tasks.json")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating data directory:", error)
  }
}

// Initialize storage with default data
export async function initializeStorage() {
  await ensureDataDir()

  // Check if tasks file exists, create with empty data if not
  try {
    await fs.access(TASKS_FILE)
  } catch {
    await fs.writeFile(
      TASKS_FILE,
      JSON.stringify({
        build: [],
        destroy: [],
      }),
    )
  }

  // Check if projects file exists, create with default data if not
  try {
    await fs.access(PROJECTS_FILE)
  } catch {
    await fs.writeFile(
      PROJECTS_FILE,
      JSON.stringify([
        {
          project_type: "build",
          title: "Build Day",
          date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          project_type: "destroy",
          title: "Destroy Day",
          date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]),
    )
  }

  console.log("Storage initialized successfully")
  return true
}

// Tasks operations
export async function getTasks(projectType: string) {
  await ensureDataDir()

  try {
    const data = await fs.readFile(TASKS_FILE, "utf8")
    const tasksData = JSON.parse(data)
    return tasksData[projectType] || []
  } catch (error) {
    console.error("Error reading tasks:", error)
    return []
  }
}

export async function saveTasks(tasks: any[], projectType: string) {
  await ensureDataDir()

  try {
    // Read current data
    let tasksData = {}
    try {
      const data = await fs.readFile(TASKS_FILE, "utf8")
      tasksData = JSON.parse(data)
    } catch {
      tasksData = { build: [], destroy: [] }
    }

    // Update with new tasks
    tasksData[projectType] = tasks

    // Write back to file
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasksData, null, 2))
    console.log(`Tasks saved for project: ${projectType}`)
  } catch (error) {
    console.error("Error saving tasks:", error)
    throw error
  }
}

// Projects operations
export async function getProjects() {
  await ensureDataDir()

  try {
    const data = await fs.readFile(PROJECTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading projects:", error)
    return []
  }
}

export async function saveProject(projectType: string, title?: string, date?: string) {
  await ensureDataDir()

  try {
    // Read current projects
    let projects = []
    try {
      const data = await fs.readFile(PROJECTS_FILE, "utf8")
      projects = JSON.parse(data)
    } catch {
      projects = []
    }

    // Find existing project or create new one
    const existingIndex = projects.findIndex((p) => p.project_type === projectType)
    const projectData = {
      project_type: projectType,
      title: title || (projectType === "build" ? "Build Day" : "Destroy Day"),
      date: date || null,
      updated_at: new Date().toISOString(),
    }

    if (existingIndex >= 0) {
      projects[existingIndex] = {
        ...projects[existingIndex],
        ...projectData,
      }
    } else {
      projects.push({
        ...projectData,
        created_at: new Date().toISOString(),
      })
    }

    // Write back to file
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2))
    console.log(`Project ${projectType} saved successfully`)
  } catch (error) {
    console.error("Error saving project:", error)
    throw error
  }
}

// Utility function to convert DB rows to task objects (for compatibility)
export function convertDbRowsToTasks(items: any[]): any[] {
  // This function is kept for compatibility with the existing code
  return items
}
