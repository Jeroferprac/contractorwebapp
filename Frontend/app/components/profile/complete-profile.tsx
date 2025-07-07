import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CompleteProfile() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Complete your profile</CardTitle>
        <p className="text-sm text-gray-500">
          Stay on the pulse of distributed projects with an online whiteboard to plan, coordinate and discuss
        </p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Publish now</Button>
      </CardContent>
    </Card>
  )
}
