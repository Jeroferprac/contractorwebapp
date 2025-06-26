'use client'

import React, { useState } from "react";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import FormField from "@/components/forms/FormField"
import TextareaField from "@/components/forms/TextareaField"
import FileField from "@/components/forms/FileField"
import { Label } from "@/components/ui/label"

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budgetMin: z.string(),
  budgetMax: z.string(),
  deadline: z.string(),
})

const QuotationFormPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    description: "",
    file: null as File | null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file: File | null) => {
    setForm((prev) => ({ ...prev, file }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setForm({ name: "", email: "", description: "", file: null });
    }, 1500);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Request a Quotation</h1>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Quotation request submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmitForm} className="space-y-5">
        <FormField
          label="Name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          required
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <TextareaField
          label="Project Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <FileField
          label="Attachment (optional)"
          name="file"
          onFileChange={handleFileChange}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default QuotationFormPage;
