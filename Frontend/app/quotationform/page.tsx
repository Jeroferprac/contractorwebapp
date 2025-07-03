"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/store/authStore";
import { submitQuotation, QuotationData } from "@/lib/quotation";
import { toast } from "sonner";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function QuotationForm() {
  const { backendAccessToken } = useAuth();

  const [formData, setFormData] = useState<QuotationData>({
    projectTitle: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    file: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backendAccessToken) {
      toast.error("Please login to submit a quotation");
      return;
    }

    setLoading(true);
    try {
      await submitQuotation(formData, backendAccessToken);
      toast.success("✅ Quotation submitted successfully!");
      setFormData({
        projectTitle: "",
        description: "",
        budgetMin: "",
        budgetMax: "",
        deadline: "",
        file: null,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to submit quotation");
      } else {
        toast.error("Failed to submit quotation");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12">
      <Card className="w-full max-w-2xl p-8 shadow-2xl rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 mb-4 text-center">
            Submit Your Quotation
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <Label>Project Title*</Label>
              <Input
                name="projectTitle"
                placeholder="Enter project title"
                value={formData.projectTitle}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Description*</Label>
              <Textarea
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Budget Min*</Label>
                <Input
                  type="number"
                  name="budgetMin"
                  placeholder="Minimum budget"
                  value={formData.budgetMin}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label>Budget Max*</Label>
                <Input
                  type="number"
                  name="budgetMax"
                  placeholder="Maximum budget"
                  value={formData.budgetMax}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Deadline*</Label>
              <Input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Attach File (Optional)</Label>
              <Input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={handleFileChange} />
            </div>
          
          <div className="flex justify-center">
            <Button
              type="submit"
              className="h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium px-20"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
