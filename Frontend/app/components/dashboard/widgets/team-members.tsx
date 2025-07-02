import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const teamMembers = [
  { name: "Adela Parkson", role: "Product Designer", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "Christian Mad", role: "Product Designer", avatar: "/placeholder.svg?height=40&width=40" },
  { name: "Jason Statham", role: "Junior Graphic Designer", avatar: "/placeholder.svg?height=40&width=40" },
]

export function TeamMembers() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Team members</CardTitle>
        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">3</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={member.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.role}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
