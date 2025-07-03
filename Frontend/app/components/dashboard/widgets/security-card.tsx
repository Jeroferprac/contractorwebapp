import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fingerprint } from "lucide-react"

export function SecurityCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Fingerprint className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Control card security in-app with a tap</h3>
          <p className="text-sm text-gray-500 mb-4">Discover our cards benefits, with one tap.</p>
        </div>

        <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          Cards
        </Button>
      </CardContent>
    </Card>
  )
}
