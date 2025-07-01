import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckSquare } from "lucide-react"

export function CompleteProfileWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete your profile</CardTitle>
        <p className="text-sm text-gray-500">
          Stay on the pulse of distributed projects with an online whiteboard to plan, coordinate and discuss
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Publish now</Button>
      </CardContent>
    </Card>
  )
}
