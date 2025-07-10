"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ContractorProfileCard({ profile, onEdit }: { profile: any, onEdit: () => void }) {
  return (
    <Card className="max-w-2xl mx-auto bg-white dark:bg-[#181C32] border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Contractor Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Company Name</div>
            <div className="text-gray-700 dark:text-gray-200">{profile.company_name}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Business License</div>
            <div className="text-gray-700 dark:text-gray-200">{profile.business_license}</div>
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Description</div>
            <div className="text-gray-700 dark:text-gray-200">{profile.description}</div>
          </div>
          <div className="md:col-span-2">
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Services</div>
            <div className="text-gray-700 dark:text-gray-200">{(profile.services || []).join(', ')}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Website URL</div>
            <a href={profile.website_url} className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noopener noreferrer">
              {profile.website_url}
            </a>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Rating</div>
            <div className="text-gray-700 dark:text-gray-200">{profile.rating}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Total Reviews</div>
            <div className="text-gray-700 dark:text-gray-200">{profile.total_reviews}</div>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            {profile.verified && (
              <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs rounded-full">Verified</span>
            )}
            <span className="text-gray-700 dark:text-gray-200">
              {profile.location?.city}, {profile.location?.state}, {profile.location?.country}
            </span>
          </div>
        </div>
        <div className="pt-4 flex justify-end">
          <Button
            className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold py-2 px-6 rounded-lg shadow-md"
            onClick={onEdit}
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
