"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { StorageWidget } from "@/components/profile/storage-widget"
import { UploadWidget } from "@/components/profile/upload-widget"
import { CompleteProfileWidget } from "@/components/profile/complete-profile-widget"
import { AllProjects } from "@/components/profile/all-projects"
import { GeneralInformation } from "@/components/profile/general-information"
import { NotificationSettings } from "@/components/profile/notification-settings"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Toaster } from "@/components/ui/toaster"
import { useToastNotification } from "@/lib/hooks/use-toast-notifications"
import { useAuth } from "@/store/authStore"
import { useSession } from "next-auth/react"
import { API } from "@/lib/api"
import { ProfileHeaderSkeleton } from "@/components/profile/profile-header-skeleton"
import { HeaderBar } from "@/components/dashboard/header/Header"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUserStore } from "@/store/userStore"

type UserProfile = {
  avatar?: string;
  avatar_data?: string;
  avatar_mimetype?: string;
  avatar_url?: string;
  full_name?: string;
  email?: string;
  // Add any other fields you use
  [key: string]: any;
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifySuccess, notifyError } = useToastNotification()
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  console.log("Session in ProfilePage:", session);

  const fetchUser = () => {
    setLoading(true);
    if (!session?.backendAccessToken) return;
    fetch(API.PROFILE, {
      headers: {
        Authorization: `Bearer ${session.backendAccessToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.avatar_data && data.avatar_mimetype) {
          data.avatar = `data:${data.avatar_mimetype};base64,${data.avatar_data}`;
        } else if (data.avatar_url) {
          data.avatar = data.avatar_url + "?v=" + Date.now();
        }
        setUser(data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUser();
  }, [session]);

  const handleSave = () => {
    notifySuccess("Profile saved", "Your changes have been successfully saved.")
  }

  const handleError = () => {
    notifyError("Error saving profile", "Something went wrong.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ShadCN Toaster */}
      <Toaster />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        <header className="top-0 z-30 flex flex-row items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#0b1437] border-b border-gray-200 dark:border-zinc-700 gap-3 sm:gap-4">

        {/* Top Header */}
        <HeaderBar session={session} userProfile={user} title="Profile" />
        </header>

        {/* Main Layout */}
        <div className="p-4 lg:p-8">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {loading
              ? <ProfileHeaderSkeleton />
              : user && <ProfileHeader user={user} onProfileUpdated={fetchUser} />
            }
            <Avatar>
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt="User avatar" />
              <AvatarFallback>{(user?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}</AvatarFallback>
            </Avatar>
            <StorageWidget />
            <UploadWidget />
            <CompleteProfileWidget />
            <AllProjects />
            <GeneralInformation />
            <NotificationSettings />
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-8">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-5">
                {loading
                  ? <ProfileHeaderSkeleton />
                  : user && <ProfileHeader user={user} onProfileUpdated={fetchUser} />
                }
              </div>
              <div className="col-span-4">
                <StorageWidget />
              </div>
              <div className="col-span-3">
                <CompleteProfileWidget />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <AllProjects />
              <GeneralInformation />
              <NotificationSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}