"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/store/authStore"
import { signOut } from "next-auth/react"
import { API } from "@/lib/api"

interface User {
  full_name: string
  email: string
  role: string
  phone: string
  profile_picture?: string
}

const ProfilePage = () => {
  const { token } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return
      try {
        const res = await fetch(API.PROFILE, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setUser(data)
        setFullName(data.full_name)
        setPhone(data.phone || "")
        setPreviewUrl(data.profile_picture || "")
      } catch (err) {
        toast.error("❌ Failed to load user profile")
      }
    }

    fetchUser()
  }, [token])

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPreviewUrl(reader.result as string)
      reader.readAsDataURL(file)
    }
  }, [file])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && !selected.type.startsWith("image/")) {
      toast.error("🖼️ Only image files are allowed")
      return
    }
    setFile(selected || null)
  }

  const handleSubmit = async () => {
    if (!token) return
    if (!phone || phone.length < 10) {
      toast.error("📱 Enter a valid phone number")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("full_name", fullName)
      formData.append("phone", phone)
      if (file) formData.append("profile_picture", file)

      const res = await fetch(API.PROFILE, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.detail || err.message || "❌ Update failed")
        return
      }

      toast.success("✅ Profile updated successfully")
    } catch (error) {
      toast.error("❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      // Notify backend
      await fetch(API.LOGOUT, {
        method: "POST",
        credentials: "include", // if your backend uses cookies
      });
    } catch (err) {
      // Optionally handle/log error
      console.error("Backend logout failed:", err);
    }
    // End NextAuth session
    await signOut();
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input value={user.email} disabled />
      </div>

      <div className="space-y-2">
        <Label>Role</Label>
        <Input value={user.role} disabled />
      </div>

      <div className="space-y-2">
        <Label>Phone</Label>
        <Input
          type="tel"
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Profile Picture</Label>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Preview"
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        )}
      </div>

      <Button onClick={handleSubmit} disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>

      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

export default ProfilePage
