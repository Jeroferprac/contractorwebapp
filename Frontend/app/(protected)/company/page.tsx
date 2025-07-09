"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useCompanyStore } from "@/store/companyStore";
import { useRouter } from "next/navigation";
import { CompanyProfileCard } from "@/components/company/CompanyProfileCard";
import { CompanyProjectsCard } from "@/components/company/CompanyProjectsCard";
import { CompanyForm } from "@/components/company/CompanyForm";
import ProjectForm from "@/components/company/ProjectForm"
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useUserStore } from "@/store/userStore";

export default function CompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const company = useCompanyStore((s) => s.company);
  const fetchCompany = useCompanyStore((s) => s.fetchCompany);
  const createCompany = useCompanyStore((s) => s.createCompany);
  const updateCompany = useCompanyStore((s) => s.updateCompany);
  const user = useUserStore((s) => s.user);

  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!user || user.role !== "company") {
      router.replace("/dashboard");
      return;
    }
    fetchCompany();
  }, [user, status, fetchCompany, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  if (!user || user.role !== "company") return <div className="p-8 text-red-500">Access denied</div>;

  return (
    <DashboardLayout session={session} title="Company">
      <div className="max-w-7xl mx-auto space-y-8 p-4 lg:p-8">
        {/* Company Profile Section */}
        {company ? (
          <>
            <CompanyProfileCard company={company} />
            <Button onClick={() => setShowProfileForm(true)}>Edit Profile</Button>
          </>
        ) : (
          <CompanyForm
            onSubmit={async (data) => {
              await createCompany({ ...data, profile_type: "company" });
              setShowProfileForm(false);
            }}
          />
        )}
        {showProfileForm && (
          <CompanyForm
            initial={company || undefined}
            onSubmit={async (data) => {
              await updateCompany(data);
              setShowProfileForm(false);
            }}
          />
        )}

        {/* Projects Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <Button onClick={() => setShowProjectForm(true)}>New Project</Button>
        </div>
        <CompanyProjectsCard projects={company?.projects || []} />
        {showProjectForm && (
          <ProjectForm
            onSubmit={async (data) => {
              // TODO: Add project creation logic in your store and call it here
              setShowProjectForm(false);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
