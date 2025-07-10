"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import {
  ContractorProfile,
  fetchContractorProfile,
  saveContractorProfile,
  updateContractorProfile,
} from "@/lib/contractor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ContractorProfileForm() {
  const [profile, setProfile] = useState<ContractorProfile>({
    company_name: "",
    address: "",
    phone_number: "",
    logo: null,
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchContractorProfile().then((data: ContractorProfile | null) => {
      if (data) {
        setProfile(data);
        setEditing(true);
      }
    });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev: ContractorProfile) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfile((prev: ContractorProfile) => ({
        ...prev,
        logo: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("company_name", profile.company_name);
    formData.append("address", profile.address);
    formData.append("phone_number", profile.phone_number);
    if (profile.logo) formData.append("logo", profile.logo);

    try {
      if (editing) {
        await updateContractorProfile(formData);
      } else {
        await saveContractorProfile(formData);
      }
      alert("Profile saved successfully");
    } catch (error) {
      console.error("Error saving profile", error);
      alert("Failed to save profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 p-4">
      <Card>
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">Contractor Profile</h2>
          <Input name="company_name" value={profile.company_name} onChange={handleChange} placeholder="Company Name" required />
          <Input name="address" value={profile.address} onChange={handleChange} placeholder="Address" required />
          <Input name="phone_number" value={profile.phone_number} onChange={handleChange} placeholder="Phone Number" required />
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          <Button type="submit">{editing ? "Update Profile" : "Save Profile"}</Button>
        </CardContent>
      </Card>
    </form>
  );
}
