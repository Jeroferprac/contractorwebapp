"use client";

import { useEffect, useState } from "react";
import { getAllContractorProjects, Project } from "@/lib/contractor";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getAllContractorProjects()
      .then(setProjects)
      .catch(() => console.error("Failed to fetch projects"));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Projects</h2>
        <Link href="/contractor/projects/new">
          <Button>Add New Project</Button>
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.description}</p>
              <p className="text-sm">Budget: ₹{project.budget_min} - ₹{project.budget_max}</p>
              <p className="text-sm">Deadline: {project.deadline}</p>
              <Link href={`/contractor/projects/${project.id}`}>
                <Button size="sm" variant="outline" className="mt-2 w-full">Edit</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
