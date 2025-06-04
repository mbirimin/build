import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb"

// DynamoDB configuration using environment variables
const client = new DynamoDBClient({
  region: process.env.REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(client)

const TASKS_TABLE = process.env.TASKS_TABLE || "tasks"
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || "projects"

// Initialize database (create tables if needed - handled by AWS Console)
export async function initializeDatabase() {
  console.log("DynamoDB tables should be created via AWS Console")
  console.log("Using tables:", { TASKS_TABLE, PROJECTS_TABLE })
  return true
}

// Task database operations
export async function getTasks(projectType: string) {
  try {
    const command = new QueryCommand({
      TableName: TASKS_TABLE,
      IndexName: "project_type-index", // You'll need to create this GSI
      KeyConditionExpression: "project_type = :projectType",
      ExpressionAttributeValues: {
        ":projectType": projectType,
      },
    })

    const result = await docClient.send(command)
    return result.Items || []
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

export async function saveTask(task: any, projectType: string) {
  try {
    const {
      id,
      title,
      startTime,
      endTime,
      status,
      progress,
      notes,
      parentId,
      isExpanded,
      completedAt,
      totalTime,
      locked,
    } = task

    const command = new PutCommand({
      TableName: TASKS_TABLE,
      Item: {
        id,
        project_type: projectType,
        title,
        start_time: startTime || null,
        end_time: endTime || null,
        status,
        progress,
        notes: notes || null,
        parent_id: parentId || null,
        is_expanded: isExpanded !== undefined ? isExpanded : true,
        completed_at: completedAt || null,
        total_time: totalTime || null,
        locked: locked || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })

    await docClient.send(command)
    console.log(`Task ${id} saved successfully`)
  } catch (error) {
    console.error("Error saving task:", error)
    throw error
  }
}

export async function saveTasks(tasks: any[], projectType: string) {
  try {
    // Delete existing tasks for this project first
    const existingTasks = await getTasks(projectType)

    for (const existingTask of existingTasks) {
      await deleteTask(existingTask.id)
    }

    // Save all new tasks and subtasks
    for (const task of tasks) {
      await saveTask(task, projectType)

      // Save subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        for (const subtask of task.subtasks) {
          await saveTask({ ...subtask, parentId: task.id }, projectType)
        }
      }
    }

    console.log(`All tasks saved for project: ${projectType}`)
  } catch (error) {
    console.error("Error saving tasks:", error)
    throw error
  }
}

export async function deleteTask(taskId: string) {
  try {
    // First get the task to find its project_type
    const getCommand = new GetCommand({
      TableName: TASKS_TABLE,
      Key: { id: taskId },
    })

    const result = await docClient.send(getCommand)
    if (!result.Item) return

    // Delete the task
    const deleteCommand = new DeleteCommand({
      TableName: TASKS_TABLE,
      Key: {
        id: taskId,
      },
    })

    await docClient.send(deleteCommand)

    // Delete subtasks
    const subtasks = await getTasks(result.Item.project_type)
    const subtasksToDelete = subtasks.filter((task: any) => task.parent_id === taskId)

    for (const subtask of subtasksToDelete) {
      const deleteSubtaskCommand = new DeleteCommand({
        TableName: TASKS_TABLE,
        Key: {
          id: subtask.id,
        },
      })
      await docClient.send(deleteSubtaskCommand)
    }

    console.log(`Task ${taskId} deleted successfully`)
  } catch (error) {
    console.error("Error deleting task:", error)
    throw error
  }
}

// Project database operations
export async function getProjects() {
  try {
    const command = new ScanCommand({
      TableName: PROJECTS_TABLE,
    })

    const result = await docClient.send(command)
    return result.Items || []
  } catch (error) {
    console.error("Error fetching projects:", error)
    throw error
  }
}

export async function saveProject(projectType: string, title?: string, date?: string) {
  try {
    const command = new PutCommand({
      TableName: PROJECTS_TABLE,
      Item: {
        project_type: projectType,
        title: title || (projectType === "build" ? "Build Day" : "Destroy Day"),
        date: date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })

    await docClient.send(command)
    console.log(`Project ${projectType} saved successfully`)
  } catch (error) {
    console.error("Error saving project:", error)
    throw error
  }
}

// Utility function to convert DynamoDB items to task objects
export function convertDbRowsToTasks(items: any[]): any[] {
  const taskMap = new Map()
  const mainTasks: any[] = []

  // First pass: create all tasks
  items.forEach((item) => {
    const task = {
      id: item.id,
      title: item.title,
      startTime: item.start_time || "",
      endTime: item.end_time || "",
      status: item.status,
      progress: item.progress,
      notes: item.notes || "",
      isExpanded: item.is_expanded,
      completedAt: item.completed_at,
      totalTime: item.total_time,
      locked: item.locked || false,
      subtasks: [],
    }

    taskMap.set(item.id, task)

    if (!item.parent_id) {
      mainTasks.push(task)
    }
  })

  // Second pass: organize subtasks
  items.forEach((item) => {
    if (item.parent_id && taskMap.has(item.parent_id)) {
      const parentTask = taskMap.get(item.parent_id)
      const childTask = taskMap.get(item.id)
      parentTask.subtasks.push(childTask)
    }
  })

  return mainTasks
}
