"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getContractorProfile } from "@/lib/contractor";
import { Contractor } from "@/types/contractor";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Star } from "lucide-react";

export default function ContractorProfilePage() {
  const { data: session } = useSession();
  const token = session?.backendAccessToken || session?.accessToken;
  const [profile, setProfile] = useState<Contractor | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      getContractorProfile(token).then(setProfile);
    }
  }, [token]);

  if (!profile) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-gradient-to-br from-[#6a6dff] to-[#8f6aff]">
      <Card className="w-full max-w-2xl shadow-2xl rounded-3xl border-0 bg-white dark:bg-[#181C32]">
        <CardHeader className="flex flex-col items-center gap-2">
          <CardTitle className="text-4xl font-extrabold text-center text-gray-900 dark:text-white">
            {profile.company_name}
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary" className="uppercase">{profile.profile_type}</Badge>
            {profile.verified ? (
              <Badge className="bg-green-500 text-white flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Verified
              </Badge>
            ) : (
              <Badge className="bg-red-500 text-white flex items-center gap-1">
                <XCircle className="w-4 h-4" /> Not Verified
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-8 pb-8">
          <div className="flex flex-wrap gap-4 justify-between">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Business License:</span>
              <div className="text-gray-900 dark:text-white">{profile.business_license || "N/A"}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Website:</span>
              <div>
                {profile.website_url ? (
                  <a
                    href={profile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 underline"
                  >
                    {profile.website_url}
                  </a>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Description:</span>
            <div className="text-gray-900 dark:text-white">{profile.description || "N/A"}</div>
          </div>
          <div>
            <span className="font-semibold text-gray-700 dark:text-gray-200">Services:</span>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.services && profile.services.length > 0 ? (
                profile.services.map((service, idx) => (
                  <Badge key={idx} className="bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100">
                    {service}
                  </Badge>
                ))
              ) : (
                <span className="text-gray-500">N/A</span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-between">
            <div>
              <span className="font-semibold text-gray-700 dark:text-gray-200">Location:</span>
              <div className="text-gray-900 dark:text-white">
                {[profile.location?.city, profile.location?.state, profile.location?.country]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-200">Rating:</span>
              <span className="text-gray-900 dark:text-white">{profile.rating}</span>
              <span className="text-gray-500">({profile.total_reviews} reviews)</span>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => router.push("/contractor/profile/edit")}
              className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold px-6 py-2 rounded-lg shadow-md"
            >
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 