"use client";
import { useParams } from "next/navigation";
import ContractorProjectForm from "@/components/forms/contractor-project-form";

export default function EditProjectPage() {
  const { projectId } = useParams();
  return <ContractorProjectForm projectId={projectId as string} />;
}
