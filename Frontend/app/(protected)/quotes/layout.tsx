import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useSession } from "next-auth/react";

export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout session={null} title="Quotes">
      <div className="p-6 bg-gray-100 min-h-screen">
        {children}
      </div>
    </DashboardLayout>
  );
}
