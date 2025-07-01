import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { Session } from "next-auth"

export function ProfileHeader({ session }: { session: Session | null }) {
  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* More options */}
        <div className="absolute top-4 right-4">
          <MoreHorizontal className="h-5 w-5 text-white" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar>
            <AvatarImage
              src={session?.user?.image || "/profile/window.svg"}
              alt={session?.user?.name || "User"}
            />
            <AvatarFallback>
              {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Adela Parkson</h2>
          <p className="text-gray-500 mb-4">Product Designer</p>

          {/* Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">17</div>
              <div className="text-sm text-gray-500">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">9.7k</div>
              <div className="text-sm text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">274</div>
              <div className="text-sm text-gray-500">Following</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
