"use client"

import {  useState } from "react"
import { signIn } from "next-auth/react"
import {  Moon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>

export default function SignInPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })
  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      toast.error("❌ Something went wrong");
    }
  }

 const handleGitHubLogin = () => {
  signIn("github")
}

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16 bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-8 text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Enter your email and password to sign in!</p>
          </div>

          {/* GitHub Login */}
          <Button
            variant="outline"
            className="w-full mb-6 h-12 border-gray-200 hover:bg-gray-50"
            onClick={handleGitHubLogin}
          >
            <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor" className="mr-2">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            Sign in with GitHub
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="h-12 border-gray-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password*</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Min. 6 characters"
                          className="h-12 border-gray-200 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remember me */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keep-logged-in"
                    checked={keepLoggedIn}
                      onCheckedChange={(checked) => setKeepLoggedIn(checked === true)}

                    className="border-gray-300"
                  />
                  <Label htmlFor="keep-logged-in" className="text-sm text-gray-700">
                    Keep me logged in
                  </Label>
                </div>
                <Link href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700">
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* Register */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Not registered yet?{" "}
            <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Create an Account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-8">
          <p className="text-xs text-gray-400 text-center">
            © 2025 Horizon UI. All Rights Reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="w-full bg-gradient-to-br from-purple-400 via-purple-600 to-blue-600 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-purple-600/20 to-blue-600/20" />

          {/* Logo */}
          <div className="relative z-10 mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full" />
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h2 className="text-4xl font-bold text-white mb-12 relative z-10">Horizon UI</h2>

          {/* CTA Box */}
          <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center max-w-sm">
            <p className="text-white/90 mb-4">Learn more about Horizon UI on</p>
            <p className="text-white font-semibold text-xl">horizon-ui.com</p>
          </div>

          {/* Footer Links */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/80 text-sm">
            <div className="flex space-x-6">
              <Link href="/marketplace" className="hover:text-white">
                Marketplace
              </Link>
              <Link href="/license" className="hover:text-white">
                License
              </Link>
              <Link href="/terms" className="hover:text-white">
                Terms of Use
              </Link>
              <Link href="/blog" className="hover:text-white">
                Blog
              </Link>
            </div>
            <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 p-2">
              <Moon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}