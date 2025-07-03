import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Cloud } from "lucide-react"

export function StorageWidget() {
  const usedStorage = 25.6
  const totalStorage = 50
  const usagePercentage = (usedStorage / totalStorage) * 100

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Cloud className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <CardTitle>Your storage</CardTitle>
        <p className="text-sm text-gray-500">Supervise your drive space in the easiest way</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{usedStorage} Gb</span>
            <span>{totalStorage} GB</span>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}