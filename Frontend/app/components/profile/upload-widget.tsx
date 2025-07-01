import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function UploadWidget() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Upload className="h-6 w-6 text-purple-600" />
          </div>
        </div>
        <CardTitle>Upload Files</CardTitle>
        <p className="text-sm text-gray-500">PNG, JPG and GIF files are allowed</p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">Publish now</Button>
      </CardContent>
    </Card>
  )
}
