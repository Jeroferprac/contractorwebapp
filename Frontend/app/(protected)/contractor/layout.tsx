import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout title="Contractor Profile">
      {children}
    </DashboardLayout>
  );
} 