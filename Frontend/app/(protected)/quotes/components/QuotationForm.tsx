"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { submitQuotation } from "@/lib/quotation";

export default function QuotationForm() {
  const { status } = useSession();

  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    estimatedBudgetMin: "",
    estimatedBudgetMax: "",
    deadline: "",
    file: null as File | null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "file" && e.target instanceof HTMLInputElement) {
      const files = e.target.files;
      setFormData({ ...formData, file: files?.[0] ?? null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (status !== "authenticated") {
      alert("You must be logged in to submit a quotation.");
      return;
    }

    const form = new FormData();
    form.append("project_title", formData.projectTitle);
    form.append("description", formData.description);
    form.append("estimated_budget_min", formData.estimatedBudgetMin);
    form.append("estimated_budget_max", formData.estimatedBudgetMax);
    form.append("deadline", formData.deadline);

    if (formData.file) {
      form.append("attachments", formData.file);
    }

    try {
      await submitQuotation(form);
      alert("Quotation submitted successfully!");
      setFormData({
        projectTitle: "",
        description: "",
        estimatedBudgetMin: "",
        estimatedBudgetMax: "",
        deadline: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to submit quotation.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Submit Your Quotation</h2>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Project Title*</label>
          <input
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border h-24 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Budget Min*</label>
            <input
              type="number"
              name="estimatedBudgetMin"
              value={formData.estimatedBudgetMin}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Budget Max*</label>
            <input
              type="number"
              name="estimatedBudgetMax"
              value={formData.estimatedBudgetMax}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Deadline*</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
            className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 dark:text-gray-300">Attach File (Optional)</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-2 rounded-md hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
