"use client"

import { useState } from "react"
import { submitQuotation, QuotationData } from "@/lib/quotation"
import { useSession } from "next-auth/react"

export default function QuotationForm() {
  const { data: session } = useSession()
  const [formData, setFormData] = useState<QuotationData>({
    projectTitle: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    file: null,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "file" && e.target instanceof HTMLInputElement && e.target.files) {
      setFormData({ ...formData, file: e.target.files[0] })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.backendAccessToken) {
      alert("You must be logged in to submit a quotation.")
      return
    }
    await submitQuotation(formData, session.backendAccessToken)
    alert("Quotation submitted successfully!")
  }

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
            placeholder="Enter project title"
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
            placeholder="Enter project description"
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
              type="text"
              name="budgetMin"
              placeholder="Minimum budget"
              value={formData.budgetMin}
              onChange={handleChange}
              required
              className="w-full p-2 rounded-md border dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Budget Max*</label>
            <input
              type="text"
              name="budgetMax"
              placeholder="Maximum budget"
              value={formData.budgetMax}
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
  )
}
