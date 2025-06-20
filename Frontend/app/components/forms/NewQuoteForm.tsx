"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useQuoteStore } from "@/store/quoteStore"
import { v4 as uuid } from "uuid"

const schema = z.object({
  contractor: z.string().min(2, "Contractor name is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["Pending", "Approved", "Rejected"]),
})

type FormData = z.infer<typeof schema>

export default function NewQuoteForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const addQuote = useQuoteStore((state) => state.addQuote)

  const onSubmit = (data: FormData) => {
    const newQuote = {
      id: uuid(),
      ...data,
    }
    addQuote(newQuote)
    toast.success("Quote added!")
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-semibold">New Quote</h2>

      <Input placeholder="Contractor Name" {...register("contractor")} />
      {errors.contractor && <p className="text-red-500 text-sm">{errors.contractor.message}</p>}

      <Input placeholder="Amount" {...register("amount")} />
      {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}

      <select {...register("status")} className="w-full border rounded px-3 py-2">
        <option value="">Select Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
      {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}

      <Button type="submit" className="w-full">Submit</Button>
    </form>
  )
}
