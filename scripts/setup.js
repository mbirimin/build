const fs = require("fs")
const path = require("path")

// Create necessary directories
const directories = ["data", "data/backups", "logs"]

directories.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
})

// Create initial data files
const dataDir = path.join(process.cwd(), "data")

// Initial tasks data
const initialTasks = {
  build: [],
  destroy: [],
}

const tasksFile = path.join(dataDir, "tasks.json")
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify(initialTasks, null, 2))
  console.log("Created initial tasks.json")
}

// Initial projects data
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

const projectsFile = path.join(dataDir, "projects.json")
if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify(initialProjects, null, 2))
  console.log("Created initial projects.json")
}

// Create .env.local if it doesn't exist
const envFile = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envFile)) {
  const envContent = `# EC2 Configuration
NODE_ENV=production
PORT=3000
DATA_PATH=${path.join(process.cwd(), "data")}
BACKUP_ENABLED=true
LOG_LEVEL=info
`
  fs.writeFileSync(envFile, envContent)
  console.log("Created .env.local")
}

console.log("Setup completed successfully!")
