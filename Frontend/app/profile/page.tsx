"use client"

import { useState } from "react"
import { Sidebar } from "@/components/profile/sidebar"
import { TopHeader } from "@/components/profile/top-header"
import { StorageWidget } from "@/components/profile/storage-widget"
import { UploadWidget } from "@/components/profile/upload-widget"
import { CompleteProfileWidget } from "@/components/profile/complete-profile-widget"
import { AllProjects } from "@/components/profile/all-projects"
import { GeneralInformation } from "@/components/profile/general-information"
import { NotificationSettings } from "@/components/profile/notification-settings"
import { ProfileHeader } from "@/components/profile/profile-header"
import { Toaster } from "@/components/ui/toaster"
import { useToastNotification } from "@/lib/hooks/use-toast-notifications"

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { notifySuccess, notifyError } = useToastNotification()

  const handleSave = () => {
    // Example usage of toast
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
        {/* Top Header */}
        <TopHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Main Layout */}
        <div className="p-4 lg:p-8">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <ProfileHeader />
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
                <ProfileHeader />
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
