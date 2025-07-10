import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export function UploadFiles() {
  return (
    <Card>
      <CardHeader className="text-center dark:bg-[#020817]">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <Upload className="w-6 h-6 text-purple-600" />
        </div>
        <CardTitle className="text-lg">Upload Files</CardTitle>
        <p className="text-sm text-gray-500">PNG, JPG and GIF files are allowed</p>
      </CardHeader>
      <CardContent>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">Upload now</Button>
      </CardContent>
    </Card>
  )
}
