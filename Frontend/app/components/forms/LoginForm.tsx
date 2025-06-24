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
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const { setToken } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("https://contractorhub-api.free.beeceptor.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        toast.error("❌ Login failed")
        throw new Error("Login failed")
      }

      setToken(result.token)

      toast("🚀 Logged in successfully!", {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900">Login to Your Account</h2>

      {/* Email Field */}
      <div>
        <Input placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <Input type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Login
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <div className="flex-1 h-px bg-gray-200" />
        or
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* OAuth Buttons (placeholders for now) */}
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/google`}
      >
        <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
        Sign in with Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/oauth/github`}
      >
        <img src="/github-icon.svg" alt="GitHub" className="w-5 h-5" />
        Sign in with GitHub
      </Button>
    </form>
  )
}
