import ContractorProjectForm from "@/components/forms/contractor-project-form";

interface ProjectPageProps {
  params: {
    projectId: string;
  };
}

export default function EditContractorProjectPage({ params }: ProjectPageProps) {
  return <ContractorProjectForm mode="edit" projectId={params.projectId} />;
}
