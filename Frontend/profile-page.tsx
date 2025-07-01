import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { ProfileHeader } from "./components/profile-header"
import { StorageWidget } from "./components/storage-widget"
import { UploadWidget } from "./components/upload-widget"
import { CompleteProfileWidget } from "./components/complete-profile-widget"
import { ProjectsSection } from "./components/projects-section"
import { GeneralInformation } from "./components/general-information"
import { NotificationsSection } from "./components/notifications-section"

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          {/* Profile Header */}
          <div className="mb-6">
            <ProfileHeader />
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
