// app/(protected)/contractor/page.tsx

import ContractorProfileForm from "@/components/forms/contractor-profile-form";

export default function ContractorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Contractor Profile</h1>
      <ContractorProfileForm />
    </div>
  );
}
