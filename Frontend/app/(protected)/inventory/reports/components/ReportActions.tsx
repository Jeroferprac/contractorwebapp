import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileBarChart2, FilePieChart, Info } from "lucide-react"

export function ReportActions() {
  return (
    <Card className="h-fit bg-gradient-to-br from-cyan-50 via-white to-purple-50 dark:from-[#1e293b] dark:via-[#181c2a] dark:to-[#312e81] shadow-xl border-0">
      <CardHeader className="pb-3 flex flex-row items-center gap-2">
        <FileBarChart2 className="w-5 h-5 text-cyan-500" />
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-xs py-2 shadow-md flex items-center gap-2 transition-all duration-200">
            <Download className="w-4 h-4" />
            Download All Reports (PDF)
          </Button>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs py-2 shadow-md flex items-center gap-2 transition-all duration-200">
            <FilePieChart className="w-4 h-4" />
            Download Defect Sale Report
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
