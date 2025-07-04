"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Camera, Trash2, Edit } from "lucide-react";
import { EditProfileModal } from "./edit-profile-modal";
import { useToast } from "@/components/ui/use-toast";
import { API } from "@/lib/api";
import { useAuth } from "@/store/authStore";

// optional: make sure this matches your API response
interface User {
  full_name: string;
  role: string;
  avatar: string | null;
}

export function ProfileHeader() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { backendAccessToken } = useAuth();
  const { toast } = useToast();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(API.PROFILE, {
        headers: {
          Authorization: `Bearer ${backendAccessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setUser({
        full_name: data.full_name ?? "Unknown User",
        role: data.role ?? "N/A",
        avatar: data.avatar ?? null,
      });
      setAvatarError(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load profile.",
        variant: "destructive",
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRemovePhoto = async () => {
    try {
      const res = await fetch(API.DELETE_AVATAR, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${backendAccessToken}` },
      });
      if (!res.ok) throw new Error("Failed to delete avatar");
      toast({
        title: "Success",
        description: "Avatar removed successfully.",
      });
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to remove avatar.",
        variant: "destructive",
      });
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar_file", file);

    setIsUploading(true);
    try {
      const res = await fetch(API.UPLOAD_AVATAR, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${backendAccessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      toast({
        title: "Success",
        description: "Avatar updated successfully.",
      });
      setAvatarError(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to upload avatar.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden p-6">
        <Skeleton className="h-32 md:h-40 w-full rounded-lg mb-4" />
        <div className="flex flex-col items-center text-center -mt-16">
          <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white" />
          <Skeleton className="h-6 w-32 mt-4" />
          <Skeleton className="h-4 w-24 mt-2" />
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="p-6 text-center text-red-500">
        Failed to load profile.
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden">
        <div className="h-32 md:h-40 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 relative">
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRemovePhoto}
                className="text-red-600"
                disabled={isUploading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative">
              <img
                src={
                  avatarError || !user?.avatar
                    ? "/placeholder.svg"
                    : user.avatar
                }
                onError={() => setAvatarError(true)}
                alt={`${user?.full_name}'s profile picture`}
                className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white object-cover shadow-lg ${
                  isUploading ? "opacity-50" : ""
                }`}
              />
              <label
                className={`absolute bottom-0 right-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center ${
                  isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700 cursor-pointer"
                } transition-colors shadow-lg`}
              >
                {isUploading ? (
                  <svg
                    className="animate-spin h-3 w-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
                    ></path>
                  </svg>
                ) : (
                  <Camera className="w-3 h-3" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col items-center text-center pt-14">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {user.full_name}
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              {user.role}
            </p>
          </div>
        </div>
      </Card>

      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onProfileUpdated={fetchProfile}
      />
    </>
  );
}
