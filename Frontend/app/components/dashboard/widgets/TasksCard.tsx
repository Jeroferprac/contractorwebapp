"use client"

import { MoreHorizontal } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

const tasks = [
  { text: "Landing Page Design", completed: false },
  { text: "Dashboard Builder", completed: true },
  { text: "Mobile App Design", completed: true },
  { text: "Illustrations", completed: false },
  { text: "Promotional LP", completed: true },
]

export default function TasksCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tasks</CardTitle>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-3">
              <Checkbox checked={task.completed} />
              <span className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
