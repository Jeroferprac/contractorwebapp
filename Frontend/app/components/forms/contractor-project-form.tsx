import { useState } from "react";
import { createContractorProject, updateContractorProject } from "@/lib/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ContractorProjectForm({ project, onSuccess }: { project?: any, onSuccess?: () => void }) {
  const [form, setForm] = useState({
    title: project?.title || "",
    description: project?.description || "",
    category: project?.category || "",
    project_value: project?.project_value || "",
    completion_date: project?.completion_date ? project.completion_date.slice(0, 10) : "",
    status: project?.status || "completed",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (project?.id) {
        await updateContractorProject(project.id, form);
      } else {
        await createContractorProject(form);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      alert("Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6">
      <Card className="bg-white dark:bg-[#181C32] border border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {project ? "Edit Project" : "Add Project"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="title" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Title</Label>
            <Input id="title" name="title" value={form.title} onChange={handleChange} required className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="description" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Description</Label>
            <Input id="description" name="description" value={form.description} onChange={handleChange} className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Category</Label>
            <Input id="category" name="category" value={form.category} onChange={handleChange} className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="project_value" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Project Value</Label>
            <Input id="project_value" name="project_value" type="number" value={form.project_value} onChange={handleChange} className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="completion_date" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Completion Date</Label>
            <Input id="completion_date" name="completion_date" type="date" value={form.completion_date} onChange={handleChange} className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700" />
          </div>
          <div>
            <Label htmlFor="status" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">Status</Label>
            <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23263A] text-gray-900 dark:text-white">
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="planned">Planned</option>
            </select>
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold py-2 px-6 rounded-lg shadow-md" disabled={loading}>
              {loading ? "Saving..." : project ? "Update Project" : "Save Project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
