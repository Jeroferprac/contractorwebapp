import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const tasks = [
  { text: "Landing Page Design", completed: false },
  { text: "Dashboard Builder", completed: true },
  { text: "Mobile App Design", completed: true },
  { text: "Illustrations", completed: false },
  { text: "Promotional LP", completed: true },
]

export function TasksWidget() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Checkbox checked={task.completed} />
              <span className={`text-sm ${task.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
