"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal } from "lucide-react"
import { useSession } from "next-auth/react"
import type { Session } from "next-auth"

interface ProfileHeaderProps {
  userProfile?: any
  session: Session | null

}

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const { data: session, status } = useSession()

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <Card className="relative overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>
        <div className="relative px-6 pb-6">
          <div className="flex justify-center -mt-12 mb-4">
            <div className="h-24 w-24 border-4 border-white shadow-lg rounded-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="text-center">
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-4 animate-pulse"></div>
            <div className="flex justify-center space-x-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Use userProfile data if available, otherwise fall back to session data
  const displayName = userProfile?.name || session?.user?.name || "Guest User"
  const displayTitle = userProfile?.title || "Product Designer"
  const profileImage = userProfile?.avatar || session?.user?.image

  // Get first letter for fallback avatar
  const avatarFallback = displayName?.[0]?.toUpperCase() || "U"

  return (
    <Card className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800"></div>

      {/* Profile content */}
      <div className="relative px-6 pb-6">
        {/* More options */}
        <div className="absolute top-4 right-4">
          <MoreHorizontal className="h-5 w-5 text-white cursor-pointer hover:text-gray-200" />
        </div>

        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profileImage || "/placeholder.svg?height=96&width=96"} alt={displayName} />
            <AvatarFallback className="text-2xl font-semibold bg-gray-100 text-gray-600">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* User info */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h2>
          <p className="text-gray-600 mb-4 dark:text-white">{displayTitle}</p>

          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-green-600 mb-2 p-2  rounded ">
              {/* {session ? `✅ Logged in as ${session.user?.name || session.user?.email}` : "❌ No session"} */}
              {session ? `✅ verfied ${session.user?.name || session.user?.email}` : "❌ No session"}
            </div>
          )}

          {/* Stats */}
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile?.stats?.posts || 17}</div>
              <div className="text-sm text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile?.stats?.followers || "9.7k"}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{userProfile?.stats?.following || 274}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
