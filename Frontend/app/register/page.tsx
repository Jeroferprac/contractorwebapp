"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "sonner"
import { useAuth } from "@/store/authStore"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { API } from "@/lib/api"

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(8, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  role: z.string().min(1, "Role is required"),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const { setToken } = useAuth()

  const [roles, setRoles] = useState<string[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      country: "India",
      role: "",
    },
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(API.ROLES)
        const data = await res.json()
        setRoles(Array.isArray(data) ? data : data.roles || [])
      } catch (error) {
        console.error("Failed to load roles:", error)
        toast.error("⚠️ Could not load roles from server")
        setRoles(["client", "company", "contractor"])
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(API.REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.name,
          phone: `+${data.phone}`,
          role: data.role,
        }),
      })

      const result = await res.json()

      if (!res.ok) {
        const errorMessage =
          Array.isArray(result)
            ? result.map((e) => e.msg).join("\n")
            : result?.detail || result?.message || "❌ Registration failed"

        toast.error(errorMessage)
        throw new Error(errorMessage)
      }

      toast.success("✅ Registered successfully")
      setToken(result.access_token)
      router.push("/dashboard")
      form.reset()
    } catch (error) {
      console.error("Registration error:", error)
    }
  }
 const handleGitHubLogin = () => {
  const redirectUri = `${window.location.origin}/auth/callback`  // ✅ e.g. http://localhost:3000/auth/callback
  const githubUrl = API.OAUTH("github", encodeURIComponent(redirectUri)) // ✅ encode it!
  window.location.href = githubUrl
}



  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute right-4 top-4 md:right-8 md:top-8">
        <Link href="/login">
          <Button variant="ghost">Login</Button>
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to register
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input id="name" autoComplete="name" placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" autoComplete="email" placeholder="you@example.com" {...field} />
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
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" autoComplete="new-password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone">Phone</FormLabel>
                  <FormControl>
                    <PhoneInput
                      inputProps={{ id: "phone", name: "phone", autoComplete: "tel" }}
                      country="in"
                      enableSearch
                      value={field.value}
                      onChange={field.onChange}
                      inputClass="!bg-background !text-foreground !w-full"
                      buttonClass="!bg-muted"
                      containerClass="!w-full"
                      dropdownClass="!bg-popover !text-foreground"
                      searchClass="!bg-background !text-foreground"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormControl>
                    <Input id="country" autoComplete="country-name" placeholder="Country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="role">Role</FormLabel>
                  <Select disabled={loadingRoles} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingRoles ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Register
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleGitHubLogin()}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          GitHub
        </Button>

        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{' '}and{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>.
        </p>
      </div>
    </div>
  )
}
