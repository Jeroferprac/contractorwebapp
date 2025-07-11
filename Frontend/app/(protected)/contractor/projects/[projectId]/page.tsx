"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchContractorProject } from "@/lib/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function ProjectDetailsPage() {
  const { data: session } = useSession();
  const token = session?.backendAccessToken || session?.accessToken;
  const params = useParams();
  const projectId = params?.projectId as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !projectId) return;
    setLoading(true);
    setError(null);
    fetchContractorProject(projectId, token)
      .then(setProject)
      .catch(() => setError("Failed to load project."))
      .finally(() => setLoading(false));
  }, [token, projectId]);

  if (!token) return <div>Please sign in to view this project.</div>;
  if (loading) return <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading project...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!project) return <div>No project found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            {project.title}
          </CardTitle>
          <Badge
            className={`capitalize px-3 py-1 text-sm font-semibold shadow-sm ${
              project.status === "completed"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : project.status === "in_progress"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {project.status.replace("_", " ")}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 pt-0 pb-4 px-6">
          <div>
            <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Description</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{project.description || "N/A"}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Category</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{project.category || "N/A"}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Value</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">₹{project.project_value || "N/A"}</span>
          </div>
          <div>
            <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Completion Date</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {project.completion_date
                ? new Date(project.completion_date).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
