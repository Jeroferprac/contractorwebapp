'use client';
import { useCompanyStore } from '@/store/companyStore';
import { ProjectCard } from '@/components/company/ProjectCard';
import ProjectForm from '@/components/company/ProjectForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useState, useEffect } from 'react';
import type { ProjectFormData } from '@/components/company/ProjectForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export default function ProjectsPage() {
  const projects = useCompanyStore((state) => state.projects);
  const projectsLoading = useCompanyStore((state) => state.projectsLoading);
  const fetchProjects = useCompanyStore((state) => state.fetchProjects);
  const createProject = useCompanyStore((state) => state.createProject);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = async (data: ProjectFormData) => {
    await createProject(data);
    setShowForm(false);
    toast({
      title: "Project created!",
      description: "You can now manage your projects here."
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Projects</h1>
          <Button onClick={() => setShowForm(true)} variant="gradient">
            {projects.length === 0 ? "Create New Project" : "Add New Project"}
          </Button>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
            <DialogHeader>
              <DialogTitle className='bg-gradient-to-r'>Create New Project</DialogTitle>
              <DialogClose asChild>
                <button className="absolute top-2 right-2">×</button>
              </DialogClose>
            </DialogHeader>
            <ProjectForm
              onSubmit={handleProjectCreated}
              onCancel={() => setShowForm(false)}
            />
          </DialogContent>
        </Dialog>
        {projectsLoading ? (
          <div>Loading projects...</div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div>No projects found.</div>
        )}
      </div>
    </DashboardLayout>
  );
}
