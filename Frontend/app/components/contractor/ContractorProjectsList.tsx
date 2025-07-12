import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchContractorProjects } from "@/lib/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, FolderKanban } from "lucide-react";
import { Project } from "@/types/contractor";

export default function ContractorProjectsList({ onEdit }: { onEdit?: (project: Project) => void }) {
  const { data: session } = useSession();
  const token = session?.backendAccessToken || session?.accessToken;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    fetchContractorProjects(token)
      .then(setProjects)
      .catch(() => {
        setError("Failed to fetch projects. Please make sure you are logged in.");
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return <div>Please sign in to view your projects.</div>;
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
          No projects found.
        </div>
      ) : (
        projects.map((project) => (
          <Card
            key={project.id}
            className="relative bg-white dark:bg-gradient-to-br dark:from-[#181C32] dark:to-[#23263A] border-0 shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.03] hover:shadow-2xl flex flex-col"
          >
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a6dff] to-[#8f6aff]" />
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderKanban className="h-6 w-6 text-[#6a6dff] dark:text-[#8f6aff]" />
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {project.title}
                  </CardTitle>
                </div>
                <Badge
                  className={`capitalize px-3 py-1 text-sm font-semibold shadow-sm flex items-center gap-1 ${
                    project.status === "completed"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      : project.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full mr-1"
                    style={{
                      background:
                        project.status === "completed"
                          ? "#22c55e"
                          : project.status === "in_progress"
                          ? "#eab308"
                          : "#3b82f6",
                    }}
                  />
                  {project.status?.replace("_", " ") || "Unknown"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0 pb-4 px-6 flex-1">
              <div>
                <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Description</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{project.description || "N/A"}</span>
              </div>
              <div className="flex justify-between gap-2">
                <div>
                  <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Category</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{project.category || "N/A"}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-400 dark:text-gray-500 mb-1">Value</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">₹{project.project_value || "N/A"}</span>
                </div>
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
            <div className="flex justify-end gap-2 px-6 pb-5">
              <Button
                variant="outline"
                className="border border-[#6a6dff] text-[#6a6dff] hover:bg-[#6a6dff] hover:text-white font-semibold transition flex items-center gap-1"
                onClick={() => onEdit && onEdit(project)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
} 