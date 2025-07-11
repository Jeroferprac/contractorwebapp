'use client';
import { useCompanyStore } from '@/store/companyStore';
import { ProjectCard } from '@/components/company/ProjectCard';
import ProjectForm from '@/components/company/ProjectForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import type { ProjectFormData } from '@/components/company/ProjectForm';
import type { CompanyProject } from '@/store/companyStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { API } from "@/lib/api";
import { useSession } from "next-auth/react";

export default function ProjectsPage() {
  const projects = useCompanyStore((state) => state.projects);
  const projectsLoading = useCompanyStore((state) => state.projectsLoading);
  const fetchProjects = useCompanyStore((state) => state.fetchProjects);
  const createProject = useCompanyStore((state) => state.createProject);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState<CompanyProject | null>(null);
  const { toast } = useToast();
  const { data: session } = useSession();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreatedOrUpdated = async (data: ProjectFormData) => {
    if (editProject) {
      await updateProject(editProject.id, data);
      setEditProject(null);
      toast({
        title: "Project updated!",
        description: "Your project has been updated."
      });
    } else {
      await createProject(data);
      toast({
        title: "Project created!",
        description: "You can now manage your projects here."
      });
    }
    setShowForm(false);
  };

  const handleEditProject = (project: CompanyProject) => {
    setEditProject(project);
    setShowForm(true);
  };

  // PATCH API call for updating a project
  const updateProject = async (id: string, data: ProjectFormData) => {
    const response = await fetch(API.PROJECTS.UPDATE(id), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: session?.backendAccessToken ? `Bearer ${session.backendAccessToken}` : "",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update project");
    await fetchProjects();
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => { setShowForm(true); setEditProject(null); }} variant="gradient">
            {projects.length === 0 ? "Create New Project" : "Add New Project"}
          </Button>
        </div>
        <Dialog open={showForm} onOpenChange={(open) => { setShowForm(open); if (!open) setEditProject(null); }}>
          <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className='bg-gradient-to-r'>{editProject ? "Edit Project" : "Create New Project"}</DialogTitle>
              <DialogClose asChild>
                <button className="absolute top-2 right-2"></button>
              </DialogClose>
            </DialogHeader>
            <ProjectForm
              initial={
                editProject
                  ? {
                      ...editProject,
                      status: (["active", "completed", "on-hold", "cancelled"].includes(editProject.status)
                        ? editProject.status
                        : "active") as "active" | "completed" | "on-hold" | "cancelled",
                      media: editProject.media?.map((m) => ({
                        ...m,
                        media_type:
                          m.media_type === "image" || m.media_type === "video" || m.media_type === "document"
                            ? m.media_type
                            : "document",
                      })),
                    }
                  : undefined
              }
              onSubmit={handleProjectCreatedOrUpdated}
              onCancel={() => { setShowForm(false); setEditProject(null); }}
            />
          </DialogContent>
        </Dialog>
        {projectsLoading ? (
          <div>Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onEdit={handleEditProject} />
              ))}
            </div>
          </div>
        ) : (
          <div>No projects found.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
