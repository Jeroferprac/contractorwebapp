
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

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

interface ContractorProfileCardProps {
  profile: ContractorProfile;
  onEdit?: () => void;
}

const ContractorProfileCard: React.FC<ContractorProfileCardProps> = ({ profile, onEdit }) => {
  return (
    <div
      className="
        relative
        w-full
        bg-white dark:bg-[#181C32]
        border border-gray-200 dark:border-gray-700
        rounded-2xl
        shadow-xl
        p-8
        transition-colors
        flex flex-col
        items-center
        mt-2
      "
    >
      {/* Top border accent like project cards */}
      <div className="absolute top-0 left-0 w-full h-2 rounded-t-2xl bg-gradient-to-r from-[#6a6dff] to-[#8f6aff]" />
      <div className="flex flex-col items-center mt-4">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500 shadow-md">
          {/* Icon */}
          <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
            <path d="M7 2v2H5.5A2.5 2.5 0 0 0 3 6.5v15h18v-15A2.5 2.5 0 0 0 18.5 4H17V2h-2v2H9V2H7zm10.5 4a.5.5 0 0 1 .5.5V6H6v-.5a.5.5 0 0 1 .5-.5H7v2h2V4h6v2h2V4h.5zM5 8h14v11H5V8zm2 2v2h2v-2H7zm4 0v2h2v-2h-2zm4 0v2h2v-2h-2z"/>
          </svg>
        </div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white text-center">{profile.company_name}</h2>
        <div className="mb-4 flex gap-2">
          <Badge variant="secondary" className="bg-blue-600 text-white">contractor</Badge>
          <Badge variant="secondary" className="bg-green-600 text-white">Verified</Badge>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 w-full text-black dark:text-white">
        <div>
          <div className="text-sm text-gray-400">Description</div>
          <div className="font-medium">{profile.description}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Website</div>
          <a href={profile.website} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {profile.website}
          </a>
        </div>
        <div>
          <div className="text-sm text-gray-400">Services</div>
          <div className="font-medium">{profile.services}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Location</div>
          <div className="font-medium">{profile.location}</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Rating</div>
          <div className="flex items-center gap-1 font-medium">
            <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            {profile.rating}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Total Reviews</div>
          <div className="font-medium">{profile.total_reviews}</div>
        </div>
      </div>
      {onEdit && (
        <div className="mt-8 flex justify-end w-full">
          <button
            className="bg-gradient-to-r from-[#6a6dff] to-[#8f6aff] text-white font-bold py-2 px-6 rounded-lg shadow-md hover:opacity-90 transition"
            onClick={onEdit}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ContractorProfileCard;
