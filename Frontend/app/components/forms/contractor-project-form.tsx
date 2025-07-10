"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  Project,
  fetchProjectById,
  createProject,
  updateProject,
} from "@/lib/contractor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContractorProjectForm({ projectId }: { projectId?: string }) {
  const [project, setProject] = useState<Project>({
    title: "",
    description: "",
    budget: 0,
    deadline: "",
  });

  useEffect(() => {
    if (projectId) {
      fetchProjectById(projectId).then((data: Project) => {
        setProject(data);
      });
    }
  }, [projectId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject((prev: Project) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);
    formData.append("budget", project.budget.toString());
    formData.append("deadline", project.deadline);

    try {
      if (projectId) {
        await updateProject(projectId, formData);
      } else {
        await createProject(formData);
      }
      alert("Project saved successfully");
    } catch (error) {
      console.error("Error saving project", error);
      alert("Failed to save project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 p-4">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">{projectId ? "Edit Project" : "New Project"}</h2>
          <Input name="title" value={project.title} onChange={handleChange} placeholder="Title" required />
          <textarea
            name="description"
            value={project.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border rounded p-2"
            required
          />
          <Input
            name="budget"
            type="number"
            value={project.budget}
            onChange={handleChange}
            placeholder="Budget"
            required
          />
          <Input
            name="deadline"
            type="date"
            value={project.deadline}
            onChange={handleChange}
            required
          />
          <Button type="submit">{projectId ? "Update Project" : "Create Project"}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
