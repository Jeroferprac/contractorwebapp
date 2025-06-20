"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/store/authStore"
import { toast } from "sonner"

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
  const router = useRouter()
  const { setToken } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("https://contractorhub-api.free.beeceptor.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error("❌ Registration failed")
        throw new Error("Failed to register")
      }

      toast.success("✅ Registered successfully")
      setToken(result.token)
      router.push("/dashboard")
      reset()
    } catch (error) {
      console.error("❌ Register error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-xl font-bold text-center">Create Account</h2>

      <Input placeholder="Name" {...register("name")} />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Input placeholder="Email" {...register("email")} />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <Input type="password" placeholder="Password" {...register("password")} />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <Button type="submit" className="w-full">Register</Button>
    </form>
  )
}
