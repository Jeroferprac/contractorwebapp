"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormField from "@/components/forms/FormField";
import TextareaField from "@/components/forms/TextareaField";
import FileField from "@/components/forms/FileField";
import { submitQuotation, QuotationData } from "@/lib/quotation";
import { useAuth } from "@/store/authStore";
import { toast } from "sonner";

const schema = z.object({
  projectTitle: z.string().min(1, "Project Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  deadline: z.string().min(1, "Deadline is required"),
  file: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof schema>;

export default function QuotationFormPage() {
  const { backendAccessToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectTitle: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      deadline: "",
      file: undefined,
    },
  });

  const handleSubmitForm = async (data: FormData) => {
    if (!backendAccessToken) {
      toast.error("⚠️ You must be logged in to submit a quotation.");
      return;
    }

    setSubmitting(true);
    try {
      const formattedData: QuotationData = {
        projectTitle: data.projectTitle,
        description: data.description,
        budgetMin: data.budgetMin,
        budgetMax: data.budgetMax,
        deadline: data.deadline,
        file: data.file ?? null,
      };

      await submitQuotation(formattedData, backendAccessToken);
      toast.success("✅ Quotation submitted successfully!");
      setSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Request a Quotation</h1>

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Quotation request submitted successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">
        <FormField
          label="Project Title"
          name="projectTitle"
          type="text"
          register={register("projectTitle")}
          error={errors.projectTitle?.message}
          required
        />

        <TextareaField
          label="Project Description"
          name="description"
          register={register("description")}
          error={errors.description?.message}
          required
        />

        <FormField
          label="Estimated Budget Min"
          name="budgetMin"
          type="number"
          register={register("budgetMin")}
          error={errors.budgetMin?.message}
        />

        <FormField
          label="Estimated Budget Max"
          name="budgetMax"
          type="number"
          register={register("budgetMax")}
          error={errors.budgetMax?.message}
        />

        <FormField
          label="Deadline"
          name="deadline"
          type="date"
          register={register("deadline")}
          error={errors.deadline?.message}
          required
        />

        <FileField
          label="Attachment (optional)"
          name="file"
          onFileChange={(file: File | null) => setValue("file", file ?? undefined)}
        />

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
