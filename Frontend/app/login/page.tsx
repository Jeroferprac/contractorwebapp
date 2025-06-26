"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/store/authStore"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const router = useRouter()
  const { setToken } = useAuth()

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })
      const result = await res.json()

      if (!res.ok) {
        toast.error("Login failed")
        return
      }

      setToken(result.access_token)
      toast.success("Logged in successfully")
      router.push("/dashboard")
    } catch (err) {
      console.error("Login Error:", err)
      toast.error("❌ Something went wrong")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-background">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <Link href="/register">
          <Button variant="ghost">Register</Button>
        </Link>
      </div>

      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to login</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div>
            <Input placeholder="Email" {...register("email")} />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <Input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full">Login</Button>
        </form>
      </div>
    </div>
  )
}
