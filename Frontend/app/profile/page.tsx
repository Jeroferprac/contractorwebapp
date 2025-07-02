import { Sidebar } from "@/components/layout/sidebar"
import { HeaderBar } from "@/components/dashboard/header/Header"
import { ProfileHeader } from "@/components/profile/profile-header"
import { StorageWidget } from "@/components/profile/storage-widget"
import { UploadWidget } from "@/components/profile/upload-widget"
import { CompleteProfileWidget } from "@/components/profile/complete-profile-widget"
import { ProjectsSection } from "@/components/profile/projects-section"
import { GeneralInformation } from "@/components/profile/general-information"
import { NotificationsSection } from "@/components/profile/notifications-section"
import { Session } from "next-auth"


export default function ProfilePage({ session }: { session: Session | null }) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0b1437]" >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden dark:bg-[#0b1437]">
        <header className="p-6 pb-4">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Pages / Profile</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          </div>
          <HeaderBar session={session} />
        </header>

        <main className="flex-1 overflow-auto p-6 dark:bg-[#0b1437]" >
          {/* Profile Header */}
          <div className="mb-6 dark:bg-[#0b1437]">
            <ProfileHeader session={session} />
          </div>

          {/* Top Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StorageWidget />
            <UploadWidget />
            <CompleteProfileWidget />
          </div>

          {/* Main Content Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <ProjectsSection />
            <GeneralInformation />
            <NotificationsSection />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            <p>© 2022 Horizon UI. All Rights Reserved. Made with love by Simmple!</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-gray-700">
                Marketplace
              </a>
              <a href="#" className="hover:text-gray-700">
                License
              </a>
              <a href="#" className="hover:text-gray-700">
                Terms of Use
              </a>
              <a href="#" className="hover:text-gray-700">
                Blog
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}