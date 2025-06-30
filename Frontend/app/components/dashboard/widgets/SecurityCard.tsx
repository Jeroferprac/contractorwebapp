"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SecurityCard() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
          </div>
          <h3 className="font-semibold mb-2">
            Control card security in-app with a tap
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Discover our cards benefits, with one tap.
          </p>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Cards
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
