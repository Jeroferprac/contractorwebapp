import { Upload } from "lucide-react"

export function CompleteProfileWidget() {
  return (
    <div className="bg-white dark:bg-[#020817] rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-900 mb-2">Complete your profile</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">
        Stay on the pulse of distributed projects with an online whiteboard to plan, coordinate and discuss
      </p>

      <div className="text-center">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-purple-500" />
        </div>

        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors w-full">
          Publish now
        </button>
      </div>
    </div>
  )
}
