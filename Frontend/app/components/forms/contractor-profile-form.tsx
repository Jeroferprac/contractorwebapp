"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import {
  getContractorProfile,
  createContractorProfile,
  updateContractorProfile,
} from "@/lib/contractor"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { useSession } from "next-auth/react"

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string(),
  logo: z
    .custom<File>()
    .refine((file) => file instanceof File || file === undefined, {
      message: "Logo must be a file",
    })
    .optional(),
})

type ContractorFormValues = z.infer<typeof formSchema>

export default function ContractorProfileForm() {
  // ✅ session is fetched but not used, so omit to avoid warning
  // const { data: session } = useSession()
  const [isExisting, setIsExisting] = useState(false)

  const form = useForm<ContractorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      logo: undefined,
    },
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getContractorProfile()
        if (data) {
          form.reset({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          })
          setIsExisting(true)
        }
      } catch (error) {
        console.error("❌ Fetch error", error)
      }
    }

    fetchProfile()
  }, [form])

  const onSubmit = async (values: ContractorFormValues) => {
    const formData = new FormData()
    formData.append("name", values.name)
    formData.append("email", values.email)
    formData.append("phone", values.phone)
    formData.append("address", values.address)
    if (values.logo) {
      formData.append("logo", values.logo)
    }

    try {
      if (isExisting) {
        await updateContractorProfile(formData)
        toast.success("✅ Profile updated!")
      } else {
        await createContractorProfile(formData)
        toast.success("✅ Profile created!")
        setIsExisting(true)
      }
    } catch (err) {
      toast.error("❌ Failed to save profile")
      console.error("Save error:", err)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl shadow-xl border border-border">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Contractor Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="Full Name" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" placeholder="Email" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl><Input placeholder="Phone Number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl><Input placeholder="Address" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {isExisting ? "Update Profile" : "Create Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
