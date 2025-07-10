import { useEffect, useState } from "react";
import { getContractorProjects } from "@/lib/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContractorProjectsList({ onEdit }: { onEdit?: (project: any) => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContractorProjects().then((data) => {
      setProjects(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-500">Loading projects...</div>;

  if (!projects.length) {
    return <div className="text-center py-8 text-gray-500">No projects found.</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id} className="bg-white dark:bg-[#181C32] border border-gray-200 dark:border-gray-700 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white mb-1">{project.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-gray-700 dark:text-gray-200">Status: <span className="font-semibold">{project.status || "N/A"}</span></div>
            <div className="text-gray-700 dark:text-gray-200">Value: <span className="font-semibold">{project.project_value ? `₹${project.project_value}` : "N/A"}</span></div>
            <Button
              className="mt-2 bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold px-4 py-1 rounded"
              onClick={() => onEdit && onEdit(project)}
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 