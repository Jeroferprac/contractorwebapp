// app/(protected)/layout.tsx
import Sidebar from "@/components/layout/sidebar";
import { HeaderBar } from "@/components/dashboard/header/Header";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <HeaderBar />
        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
