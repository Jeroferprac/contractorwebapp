import { Upload } from "lucide-react"

export function UploadWidget() {
  return (
    <div className="bg-white dark:bg-[#020817] rounded-2xl p-6 shadow-sm h-full flex flex-col justify-center text-center">
      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Upload className="w-8 h-8 text-purple-500" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Files</h3>
      <p className="text-gray-400 text-sm">PNG, JPG and GIF files are allowed</p>
    </div>
  )
}
