"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock } from "lucide-react"

export default function BusinessDesignCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
            <div className="w-6 h-6 bg-orange-500 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Business Design</span>
              <Badge variant="secondary" className="text-xs">
                New lesson is available
              </Badge>
            </div>
            <h3 className="font-semibold mb-2">
              What do you need to know to create better products?
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>85 mins</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Video format</span>
              </div>
            </div>
          </div>
          <Button>Get Started</Button>
        </div>
      </CardContent>
    </Card>
  )
}
