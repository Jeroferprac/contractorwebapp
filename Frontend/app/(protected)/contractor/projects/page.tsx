"use client";

import { useState } from "react";
import ContractorProjectsList from "@/components/contractor/ContractorProjectsList";
import ContractorProjectForm from "@/components/forms/contractor-project-form";
import { Button } from "@/components/ui/button";

export default function ContractorProjectsPage() {
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingProject(null);
    setRefreshKey((k) => k + 1); // trigger list refresh
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
        <Button
          className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold px-6 py-2 rounded-lg shadow-md"
          onClick={handleAdd}
        >
          Add Project
        </Button>
      </div>
      {showForm && (
        <div className="mb-8">
          <ContractorProjectForm project={editingProject} onSuccess={handleSuccess} />
        </div>
      )}
      <ContractorProjectsList key={refreshKey} onEdit={handleEdit} />
    </div>
  );
}
