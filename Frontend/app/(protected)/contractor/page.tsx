"use client";

import React, { useState } from "react";
import ContractorProfileCard from "@/components/ContractorProfileCard";
import ContractorProfileForm from "@/components/forms/contractor-profile-form"; // Adjust path if needed

// Define the contractor profile type
interface ContractorProfile {
  company_name: string;
  description: string;
  website: string;
  services: string;
  location: string;
  rating: number;
  total_reviews: number;
  // Add any other fields you use
}

// Example: Replace this with your actual data fetching logic
const mockProfile: ContractorProfile = {
  company_name: "SAS infotech",
  description: "mess",
  website: "https://sasinfo.com/",
  services: "General Contracting, Renovation",
  location: "vdm, andhra, India",
  rating: 5,
  total_reviews: 6,
};

export default function ContractorPage() {
  const [editing, setEditing] = useState(false);
  const profile = mockProfile; // Replace with your fetched profile

  return (
    <div
      className="
        flex justify-center items-center min-h-[calc(100vh-80px)]
        bg-[#f8fafc]
        dark:bg-gradient-to-br dark:from-[#181c2f] dark:to-[#232946]
        px-4 py-8
        transition-colors
      "
    >
      <div className="w-full max-w-2xl">
        {editing ? (
          <div
            className="
              bg-white dark:bg-[#181C32]
              rounded-2xl shadow-xl
              border border-gray-200 dark:border-gray-700
              p-8
              transition-colors
            "
          >
            <ContractorProfileForm />
          </div>
        ) : (
          <div
            className="
              bg-white dark:bg-[#181C32]
              rounded-2xl shadow-xl
              border border-gray-200 dark:border-gray-700
              p-8
              transition-colors
            "
          >
            <ContractorProfileCard profile={profile} onEdit={() => setEditing(true)} />
          </div>
        )}
      </div>
    </div>
  );
}