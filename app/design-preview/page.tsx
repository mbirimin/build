"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DesignOption1 from "../../design-option-1"
import DesignOption2 from "../../design-option-2"
import DesignOption3 from "../../design-option-3"

export default function DesignPreview() {
  const [selectedDesign, setSelectedDesign] = useState<1 | 2 | 3>(1)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Design Selector */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">UI Design Options</h1>
            <div className="flex gap-2">
              <Button
                variant={selectedDesign === 1 ? "default" : "outline"}
                onClick={() => setSelectedDesign(1)}
                className="px-6"
              >
                Option 1: Modern Cards
              </Button>
              <Button
                variant={selectedDesign === 2 ? "default" : "outline"}
                onClick={() => setSelectedDesign(2)}
                className="px-6"
              >
                Option 2: Kanban Board
              </Button>
              <Button
                variant={selectedDesign === 3 ? "default" : "outline"}
                onClick={() => setSelectedDesign(3)}
                className="px-6"
              >
                Option 3: Timeline
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Design Preview */}
      <div className="w-full">
        {selectedDesign === 1 && <DesignOption1 />}
        {selectedDesign === 2 && <DesignOption2 />}
        {selectedDesign === 3 && <DesignOption3 />}
      </div>

      {/* Design Descriptions */}
      <div className="fixed bottom-4 right-4 max-w-sm">
        <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
          <CardContent className="p-4">
            {selectedDesign === 1 && (
              <div>
                <h3 className="font-semibold mb-2">Option 1: Modern Cards</h3>
                <p className="text-sm text-gray-600">
                  Clean, spacious card layout with better visual hierarchy. Expandable tasks with progress tracking.
                </p>
              </div>
            )}
            {selectedDesign === 2 && (
              <div>
                <h3 className="font-semibold mb-2">Option 2: Kanban Board</h3>
                <p className="text-sm text-gray-600">
                  Organized by status columns (Not Started, In Progress, Completed) for easy task management and
                  workflow visualization.
                </p>
              </div>
            )}
            {selectedDesign === 3 && (
              <div>
                <h3 className="font-semibold mb-2">Option 3: Timeline</h3>
                <p className="text-sm text-gray-600">
                  Visual timeline showing when tasks happen throughout the day. Great for time-based scheduling.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
