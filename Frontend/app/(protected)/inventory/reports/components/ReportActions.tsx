import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

export function ReportActions() {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Reports for Last Month</div>
          <div className="text-xs text-gray-500">Financial Jan - Jul 24</div>
          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white text-xs py-2">
            <Download className="w-3 h-3 mr-1.5" />
            Download PDF
          </Button>
        </div>

        <div className="border-t pt-3 space-y-2">
          <div className="text-sm font-medium text-gray-700">Defect Sale Report</div>
          <div className="text-xs text-gray-500">Product Defects & Supplier Chart</div>
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white text-xs py-2">
            <Download className="w-3 h-3 mr-1.5" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
