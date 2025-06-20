"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/store/authStore"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password is required"),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const router = useRouter()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("https://contractorhub-api.free.beeceptor.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error("❌ Login failed")
        throw new Error("Login failed")
      }

      const { setToken } = useAuth.getState()
      setToken(result.token)

      toast("🚀 You’re logged in!", {
        icon: "🔥",
        style: {
          background: "#1f2937",
          color: "#fff",
          borderRadius: "10px",
          boxShadow: "0 0 10px #00f0ff",
        },
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("❌ Login error:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full">Login</Button>
    </form>
  )
}
