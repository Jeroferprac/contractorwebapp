// app/components/forms/contractor-profile-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getContractorProfile,
  createContractorProfile,
  updateContractorProfile,
  ContractorProfile,
} from "@/lib/contractor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

export default function ContractorProfileForm() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [isExisting, setIsExisting] = useState(false);
  const [profile, setProfile] = useState<ContractorProfile>({
    company_name: "",
    email: "",
    phone: "",
    address: "",
    logo: null,
  });

  useEffect(() => {
    if (status === "authenticated") {
      getContractorProfile()
        .then((data) => {
          if (data) {
            setProfile(data);
            setIsExisting(true);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setProfile((prev) => ({ ...prev, logo: file }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isExisting) {
        await updateContractorProfile(profile);
        toast({ title: "Profile updated successfully!" });
      } else {
        await createContractorProfile(profile);
        toast({ title: "Profile created successfully!" });
        setIsExisting(true);
      }
    } catch (err) {
      console.error("Contractor profile error", err);
      toast({
        title: "Error",
        description: "Profile creation failed. Check your session and fields.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <p className="text-center p-8">Checking authentication...</p>;
  if (status === "unauthenticated") return <p className="text-center p-8">Please log in to continue.</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <Card className="shadow-xl border rounded-2xl">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Contractor Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                placeholder="ABC Constructions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="example@domain.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+91..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={profile.address}
                onChange={handleChange}
                placeholder="Your full company address"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="logo">Company Logo</Label>
              <Input id="logo" type="file" onChange={handleFileChange} />
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full mt-6">
            {loading ? "Saving..." : isExisting ? "Update Profile" : "Create Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
