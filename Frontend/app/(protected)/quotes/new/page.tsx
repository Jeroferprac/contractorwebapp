"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewQuotationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedBudgetMin, setEstimatedBudgetMin] = useState("");
  const [estimatedBudgetMax, setEstimatedBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const token = session?.backendAccessToken || session?.accessToken;
    if (status !== "authenticated" || !token) {
      setError("You must be logged in to submit a quotation.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("project_title", projectTitle);
      formData.append("description", description);
      formData.append("estimated_budget_min", estimatedBudgetMin);
      formData.append("estimated_budget_max", estimatedBudgetMax);
      formData.append("deadline", deadline);
      if (attachment) {
        formData.append("attachments", attachment);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotation/quote`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.detail || "Failed to submit quotation.");
      }

      router.push("/quotes");
    } catch (err: any) {
      console.error("Error submitting quotation:", err);
      setError(err.message || "Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <p className="text-center py-10">Checking login...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1437] p-6 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
          Submit New Quotation
        </h1>

        <Card className="p-6 bg-white dark:bg-[#1e2a50] space-y-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 p-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="Enter project title"
                required
                className="bg-white dark:bg-[#0f1b3e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter project description"
                required
                className="min-h-[120px] bg-white dark:bg-[#0f1b3e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Estimated Budget Min (₹)</Label>
                <Input
                  id="budgetMin"
                  type="number"
                  value={estimatedBudgetMin}
                  onChange={(e) => setEstimatedBudgetMin(e.target.value)}
                  placeholder="e.g. 10000"
                  required
                  className="bg-white dark:bg-[#0f1b3e]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetMax">Estimated Budget Max (₹)</Label>
                <Input
                  id="budgetMax"
                  type="number"
                  value={estimatedBudgetMax}
                  onChange={(e) => setEstimatedBudgetMax(e.target.value)}
                  placeholder="e.g. 50000"
                  required
                  className="bg-white dark:bg-[#0f1b3e]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="bg-white dark:bg-[#0f1b3e]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (optional)</Label>
              <Input
                id="attachment"
                type="file"
                onChange={handleFileChange}
                className="bg-white dark:bg-[#0f1b3e]"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 dark:from-purple-600 dark:to-indigo-700 dark:hover:from-purple-700 dark:hover:to-indigo-800"
            >
              {loading ? "Submitting..." : "Submit Quotation"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
