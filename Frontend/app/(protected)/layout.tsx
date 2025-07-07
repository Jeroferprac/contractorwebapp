import { Sidebar } from "@/components/layout/sidebar";
import { HeaderBar } from "@/components/dashboard/header/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <HeaderBar />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}