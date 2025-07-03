import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function StarbucksCard() {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-800">
          <Image src="/starbuckscard.png" alt="Starbucks" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold">Starbucks</h3>
            <p className="text-sm opacity-90">10% cashback & off</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
