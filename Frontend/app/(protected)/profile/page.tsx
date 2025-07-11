"use client"

import { useState, useEffect } from "react"
import { StorageWidget } from "@/components/profile/storage-widget"
import { UploadWidget } from "@/components/profile/upload-widget"
import { CompleteProfileWidget } from "@/components/profile/complete-profile-widget"
import { AllProjects } from "@/components/profile/all-projects"
import { GeneralInformation } from "@/components/profile/general-information"
import { NotificationSettings } from "@/components/profile/notification-settings"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/store/authStore"
import { useSession } from "next-auth/react"
import { API } from "@/lib/api"
import { ProfileHeaderSkeleton } from "@/components/profile/profile-header-skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useUserStore } from "@/store/userStore"
import { DashboardLayout } from "@/components/layout/dashboard-layout";

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
    toast({ title: "Profile saved", description: "Your changes have been successfully saved.", variant: "success" })
  }

  const handleError = () => {
    toast({ title: "Error saving profile", description: "Something went wrong.", variant: "error" })
  }

  return (
    <DashboardLayout session={session} title="Profile">
      {/* ShadCN Toaster */}
      <Toaster />
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
    </DashboardLayout>
  )
}