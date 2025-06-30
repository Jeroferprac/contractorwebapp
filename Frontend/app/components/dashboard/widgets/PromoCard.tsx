"use client"

import { Card } from "@/components/ui/card"

export default function PromoCard() {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-700">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="font-bold">Starbucks</h3>
          <p className="text-sm opacity-90">10% cashback & off</p>
        </div>
      </div>
    </Card>
  )
}
