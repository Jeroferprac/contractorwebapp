"use client";

import { useEffect, useState } from "react";
import { Project, fetchProjects } from "@/lib/contractor";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProjects()
      .then((data: Project[]) => setProjects(data))
      .catch((err) => console.error("Failed to load projects:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/contractor/projects/new">New Project</Link>
        </Button>
      </div>
      {loading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="p-4 space-y-2">
                <h2 className="font-semibold text-lg">{project.title}</h2>
                <p>{project.description}</p>
                <p>Budget: ₹{project.budget}</p>
                <p>Deadline: {project.deadline}</p>
                <Button asChild>
                  <Link href={`/contractor/projects/${project.id}`}>Edit</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
