"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Project, createContractorProject, updateContractorProject } from "@/lib/contractor"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  budget_min: z.coerce.number().min(0),
  budget_max: z.coerce.number().min(0),
  deadline: z.string(),
})

type ProjectFormValues = z.infer<typeof formSchema>

interface ContractorProjectFormProps {
  project?: Project | null
}

export default function ContractorProjectForm({ project }: ContractorProjectFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      budget_min: project?.budget_min || 0,
      budget_max: project?.budget_max || 0,
      deadline: project?.deadline || "",
    },
  })

  const onSubmit = async (values: ProjectFormValues) => {
    setLoading(true)
    try {
      if (project?.id) {
        await updateContractorProject(project.id, values)
        toast.success("✅ Project updated!")
      } else {
        await createContractorProject(values)
        toast.success("✅ Project created!")
      }
      router.push("/contractor/projects")
    } catch (err) {
      toast.error("❌ Failed to save project")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget_min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Min</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Min budget" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="budget_max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Budget Max</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Max budget" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </Button>
      </form>
    </Form>
  )
}
