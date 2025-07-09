import { Cloud, MoreHorizontal } from "lucide-react"

export function StorageWidget() {
  return (
    <div className="bg-white dark:bg-[#020817] rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-end mb-2">
        <button className="p-1 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="text-center flex-grow flex flex-col justify-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Cloud className="w-8 h-8 text-blue-500" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">Your storage</h3>
        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
          Supervise your drive space
          <br />
          in the easiest way
        </p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>25.6 Gb</span>
            <span>50 GB</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: "51%" }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}
