import { NextResponse } from "next/server"
import { saveTask, getTasks } from "@/lib/db"

export async function GET() {
  try {
    console.log("Testing DynamoDB connection...")

    // Create a test task
    const testTask = {
      id: `test-${Date.now()}`,
      title: "Test Task from API",
      startTime: "09:00",
      endTime: "10:00",
      status: "Not Started",
      progress: 0,
      notes: "This is a test task",
      parentId: null,
      isExpanded: true,
      completedAt: null,
      totalTime: null,
      locked: false,
    }

    // Save the test task
    await saveTask(testTask, "build")
    console.log("Test task saved successfully")

    // Fetch tasks to verify
    const tasks = await getTasks("build")
    console.log(`Found ${tasks.length} tasks in build project`)

    return NextResponse.json({
      success: true,
      message: "DynamoDB test successful",
      testTask,
      totalTasks: tasks.length,
      allTasks: tasks,
    })
  } catch (error: any) {
    console.error("DynamoDB test failed:", error)
    return NextResponse.json(
      {
        success: false,
        message: "DynamoDB test failed",
        error: error.message,
      },
      { status: 500 },
    )
  }
}
