"use client"

import Link from "next/link"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { signIn, useSession } from "next-auth/react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { API } from "@/lib/api"
import { useAuth } from "@/store/authStore"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { setToken } = useAuth()

  // ✅ Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(API.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        const errorMessage = Array.isArray(result)
          ? result.map((e) => e.msg).join("\n")
          : result?.detail || result?.message || "❌ Login failed"
        toast.error(errorMessage)
        throw new Error(errorMessage)
      }

      toast.success("✅ Logged in successfully")
      setToken(result.access_token)
      router.push("/dashboard")
      form.reset()
    } catch (error) {
      console.error("Login error:", error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      {/* Top Right Register Link */}
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <Link href="/register">
          <Button variant="ghost">Register</Button>
        </Link>
      </div>

      {/* Login Form */}
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to login
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </div>

      {/* GitHub SSO Button (Backend OAuth flow) */}
      <div className="mx-auto w-full max-w-md mt-6">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            const redirectUri = `${window.location.origin}/auth/callback`
            const backendOAuthUrl = `http://localhost:8000/api/v1/auth/oauth/github?redirect_uri=${encodeURIComponent(redirectUri)}`
            window.location.href = backendOAuthUrl
          }}
        >
          <svg
            height="20"
            width="20"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="mr-2"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53...z" />
          </svg>
          Sign in with GitHub
        </Button>
      </div>
    </div>
  )
}
