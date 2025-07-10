"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  ContractorProfile,
  getContractorProfile,
  createContractorProfile,
  updateContractorProfile,
} from "@/lib/contractor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const defaultProfile: ContractorProfile = {
  company_name: "",
  profile_type: "contractor",
  business_license: "",
  description: "",
  website_url: "",
  services: [],
  location: {},
  verified: false,
  rating: 0.0,
  total_reviews: 0,
};

export default function ContractorProfileForm() {
  const [profile, setProfile] = useState<ContractorProfile>(defaultProfile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    getContractorProfile().then((data: ContractorProfile | null) => {
      if (data) {
        setProfile({
          ...defaultProfile,
          ...data,
        });
        setEditing(true);
      }
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      // TypeScript-safe checkbox handling
      setProfile((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === "services") {
      setProfile((prev) => ({ ...prev, services: value.split(",").map((s) => s.trim()).filter(Boolean) }));
    } else if (name === "rating" || name === "total_reviews") {
      setProfile((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      location: {
        ...(prev.location || {}),
        [name]: value,
      },
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setProfile((prev) => ({ ...prev, verified: checked }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = { ...profile };
    try {
      if (editing) {
        await updateContractorProfile(payload);
      } else {
        await createContractorProfile(payload);
      }
      alert("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile", error);
      alert("Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 min-h-[700px] flex flex-col justify-between">
      <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#181C32] flex flex-col h-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Contractor Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            <div>
              <Label htmlFor="company_name" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Company Name
              </Label>
              <Input
                id="company_name"
                name="company_name"
                value={profile.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                required
                className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="business_license" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Business License
              </Label>
              <Input
                id="business_license"
                name="business_license"
                value={profile.business_license || ""}
                onChange={handleChange}
                placeholder="Business License"
                className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="description" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={profile.description || ""}
                onChange={handleChange}
                placeholder="Description"
                className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="services" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Services
              </Label>
              <Input
                id="services"
                name="services"
                value={profile.services?.join(", ") || ""}
                onChange={handleChange}
                placeholder="Services (comma separated)"
                className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
              />
            </div>
            <div>
              <Label htmlFor="website_url" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Website URL
              </Label>
              <Input
                id="website_url"
                name="website_url"
                value={profile.website_url || ""}
                onChange={handleChange}
                placeholder="Website URL"
                className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
              />
            </div>
            <div className="flex flex-row gap-6">
              <div className="flex-1">
                <Label htmlFor="rating" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                  Rating
                </Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  value={profile.rating}
                  onChange={handleChange}
                  placeholder="Rating"
                  min={0}
                  max={5}
                  className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="total_reviews" className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                  Total Reviews
                </Label>
                <Input
                  id="total_reviews"
                  name="total_reviews"
                  type="number"
                  value={profile.total_reviews}
                  onChange={handleChange}
                  placeholder="Total Reviews"
                  min={0}
                  className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Checkbox
                id="verified"
                checked={profile.verified}
                onCheckedChange={handleCheckboxChange}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-800"
              />
              <Label htmlFor="verified" className="text-gray-900 dark:text-white font-semibold">
                Verified
              </Label>
            </div>
            <div className="md:col-span-2">
              <Label className="text-gray-900 dark:text-gray-100 font-semibold mb-2">
                Location
              </Label>
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  name="city"
                  value={profile.location?.city || ""}
                  onChange={handleLocationChange}
                  placeholder="City"
                  className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
                <Input
                  name="state"
                  value={profile.location?.state || ""}
                  onChange={handleLocationChange}
                  placeholder="State"
                  className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
                <Input
                  name="country"
                  value={profile.location?.country || ""}
                  onChange={handleLocationChange}
                  placeholder="Country"
                  className="bg-white dark:bg-[#23263A] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border border-gray-300 dark:border-gray-700"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold py-2 px-6 rounded-lg shadow-md"
            >
              {editing ? "Update Profile" : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
