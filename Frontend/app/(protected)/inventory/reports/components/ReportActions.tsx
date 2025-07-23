import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Download, FileBarChart2, FilePieChart, Info } from "lucide-react"

export function ReportActions() {
  return (
    <Card className="bg-white rounded-2xl shadow-md p-6 dark:bg-[#232946] border-0">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <FileBarChart2 className="w-5 h-5 text-cyan-500" />
          <CardTitle className="text-base font-semibold text-blue-700 dark:text-blue-300">Report Actions</CardTitle>
        </div>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Quick actions for managing and exporting your reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs py-2 shadow-md flex items-center gap-2 transition-all duration-200">
            <Download className="w-4 h-4" />
            Download All Reports as PDF
          </Button>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs py-2 shadow-md flex items-center gap-2 transition-all duration-200">
            <FilePieChart className="w-4 h-4" />
            Export Defective Sales Report
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <Info className="w-4 h-4 text-cyan-400" />
          <span>Financial Jan - Jul 24</span>
        </div>
      </CardContent>
    </Card>
  )
}
