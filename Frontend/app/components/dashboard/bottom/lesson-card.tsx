"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Video } from "lucide-react"

export function LessonCard() {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Business Design</h3>
            <p className="text-sm text-gray-600 mb-3">New lesson is available</p>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>85 mins</span>
              </div>
              <div className="flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>Video format</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">What do you need to know to create better products?</p>

            <div className="flex items-center space-x-2 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                ))}
              </div>
              <span className="text-xs text-gray-500">+</span>
            </div>

            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Play className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
