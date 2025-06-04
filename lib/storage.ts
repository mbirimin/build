import fs from "fs/promises"
import path from "path"

// Configuration
const DATA_DIR = process.env.DATA_PATH || path.join(process.cwd(), "data")
const TASKS_FILE = path.join(DATA_DIR, "tasks.json")
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json")
const BACKUP_DIR = path.join(DATA_DIR, "backups")

// Ensure directories exist
async function ensureDirectories() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  } catch (error) {
    console.error("Error creating directories:", error)
  }
}

// Backup functionality
async function createBackup(filename: string) {
  if (process.env.BACKUP_ENABLED !== "true") return

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupName = `${path.basename(filename, ".json")}_${timestamp}.json`
    const backupPath = path.join(BACKUP_DIR, backupName)

    const data = await fs.readFile(filename, "utf8")
    await fs.writeFile(backupPath, data)

    // Keep only last 10 backups
    const backups = await fs.readdir(BACKUP_DIR)
    const relevantBackups = backups
      .filter((f) => f.startsWith(path.basename(filename, ".json")))
      .sort()
      .reverse()

    if (relevantBackups.length > 10) {
      for (const backup of relevantBackups.slice(10)) {
        await fs.unlink(path.join(BACKUP_DIR, backup))
      }
    }
  } catch (error) {
    console.error("Backup failed:", error)
  }
}

// Initialize storage
export async function initializeStorage() {
  await ensureDirectories()

  // Initialize tasks file
  try {
    await fs.access(TASKS_FILE)
  } catch {
    const initialTasks = { build: [], destroy: [] }
    await fs.writeFile(TASKS_FILE, JSON.stringify(initialTasks, null, 2))
    console.log("Created initial tasks.json")
  }

  // Initialize projects file
  try {
    await fs.access(PROJECTS_FILE)
  } catch {
    const initialProjects = [
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
    ]
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2))
    console.log("Created initial projects.json")
  }

  return true
}

// Task operations
export async function getTasks(projectType: string) {
  await ensureDirectories()

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
  await ensureDirectories()

  try {
    // Create backup before saving
    try {
      await createBackup(TASKS_FILE)
    } catch (backupError) {
      console.warn("Backup failed, continuing with save:", backupError)
    }

    // Read current data
    let tasksData = { build: [], destroy: [] }
    try {
      const data = await fs.readFile(TASKS_FILE, "utf8")
      tasksData = JSON.parse(data)
    } catch {
      // File doesn't exist or is corrupted, use default
    }

    // Update with new tasks
    tasksData[projectType] = tasks

    // Write atomically (write to temp file, then rename)
    const tempFile = `${TASKS_FILE}.tmp`
    await fs.writeFile(tempFile, JSON.stringify(tasksData, null, 2))
    await fs.rename(tempFile, TASKS_FILE)

    console.log(`Tasks saved for project: ${projectType} (${tasks.length} tasks)`)
  } catch (error) {
    console.error("Error saving tasks:", error)
    throw error
  }
}

// Project operations
export async function getProjects() {
  await ensureDirectories()

  try {
    const data = await fs.readFile(PROJECTS_FILE, "utf8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading projects:", error)
    return []
  }
}

export async function saveProject(projectType: string, title?: string, date?: string) {
  await ensureDirectories()

  try {
    // Create backup before saving
    try {
      await createBackup(PROJECTS_FILE)
    } catch (backupError) {
      console.warn("Backup failed, continuing with save:", backupError)
    }

    // Read current projects
    let projects = []
    try {
      const data = await fs.readFile(PROJECTS_FILE, "utf8")
      projects = JSON.parse(data)
    } catch {
      // File doesn't exist or is corrupted, use default
    }

    // Find existing project or create new one
    const existingIndex = projects.findIndex((p: any) => p.project_type === projectType)
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

    // Write atomically
    const tempFile = `${PROJECTS_FILE}.tmp`
    await fs.writeFile(tempFile, JSON.stringify(projects, null, 2))
    await fs.rename(tempFile, PROJECTS_FILE)

    console.log(`Project ${projectType} saved successfully`)
  } catch (error) {
    console.error("Error saving project:", error)
    throw error
  }
}

// Health check
export async function healthCheck() {
  try {
    await ensureDirectories()

    // Check if files are readable
    await fs.access(TASKS_FILE, fs.constants.R_OK | fs.constants.W_OK)
    await fs.access(PROJECTS_FILE, fs.constants.R_OK | fs.constants.W_OK)

    // Check disk space (basic check)
    const stats = await fs.stat(DATA_DIR)

    return {
      status: "healthy",
      dataDir: DATA_DIR,
      tasksFile: TASKS_FILE,
      projectsFile: PROJECTS_FILE,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    }
  }
}

// Cleanup old backups
export async function cleanupBackups(daysToKeep = 7) {
  try {
    const files = await fs.readdir(BACKUP_DIR)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

    for (const file of files) {
      const filePath = path.join(BACKUP_DIR, file)
      const stats = await fs.stat(filePath)

      if (stats.mtime < cutoffDate) {
        await fs.unlink(filePath)
        console.log(`Deleted old backup: ${file}`)
      }
    }
  } catch (error) {
    console.error("Error cleaning up backups:", error)
  }
}
