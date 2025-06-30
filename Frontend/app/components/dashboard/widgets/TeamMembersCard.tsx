"use client"

import { MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const teamMembers = [
  {
    name: "Adela Parkson",
    role: "Product Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Christian Mad",
    role: "Product Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Jason Statham",
    role: "Junior Graphic Designer",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function TeamMembersCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Team members
          <Badge
            variant="secondary"
            className="rounded-full w-6 h-6 p-0 flex items-center justify-center"
          >
            {teamMembers.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
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
