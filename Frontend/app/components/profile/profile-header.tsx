"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Camera, Edit, Trash } from "lucide-react";
import { EditProfileModal } from "./edit-profile-modal";
import { useState, useRef } from "react";
import { API } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ProfileHeader({ user, onProfileUpdated }: { user: any, onProfileUpdated: () => void }) {
  const { data: session } = useSession();
  const backendAccessToken = session?.backendAccessToken;
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
  const avatarUrl = user?.avatar_data && user?.avatar_mimetype
    ? `data:${user.avatar_mimetype};base64,${user.avatar_data}`
    : (user?.avatar_url || session?.user?.image || "/placeholder.svg");

  // Debugging: log token and session
  console.log('ProfileHeader backendAccessToken:', backendAccessToken, 'session:', session);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!backendAccessToken) {
      toast({ title: "Not authenticated", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar_file", file);
      const res = await fetch(API.UPLOAD_AVATAR, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${backendAccessToken}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload avatar");
      toast({ title: "Success", description: "Avatar uploaded successfully." });
      setAvatarVersion(Date.now());
      onProfileUpdated();
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload avatar.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
    if (!backendAccessToken) {
      toast({ title: "Not authenticated", description: "Please log in again.", variant: "destructive" });
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(API.DELETE_AVATAR, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${backendAccessToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete avatar");
      toast({ title: "Success", description: "Avatar deleted successfully." });
      setAvatarVersion(Date.now());
      onProfileUpdated();
      setIsDeleteDialogOpen(false);
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete avatar.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  console.log("Avatar URL in render:", avatarUrl);

  return (
    <>
      <Card className="relative overflow-hidden bg-white dark:bg-[#020817]">
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
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                <Trash className="w-4 h-4 mr-2" />
                Delete Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
            <div className="relative group">
              {avatarUrl && avatarUrl !== "/placeholder.svg" ? (
                <img
                  src={avatarUrl}
                  alt={`${user?.full_name || user?.email || "User"}'s profile picture`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-purple-600 shadow-lg">
                  {(user?.full_name?.[0] || user?.email?.[0] || "U").toUpperCase()}
                </div>
              )}
              {/* Camera icon overlay for upload */}
              <button
                type="button"
                className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow group-hover:opacity-100 opacity-80 transition"
                onClick={handleAvatarClick}
                disabled={uploading}
                title="Upload new avatar"
              >
                <Camera className="w-5 h-5 text-purple-600" />
              </button>
              {/* Trash icon for delete if avatar exists and not using GitHub avatar */}
              {user?.avatar_url && (
                <button
                  type="button"
                  className="absolute top-2 left-2 bg-white p-1 rounded-full shadow group-hover:opacity-100 opacity-80 transition"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  disabled={deleting}
                  title="Delete avatar"
                >
                  <Trash className="w-5 h-5 text-red-500" />
                </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                ref={fileInputRef}
                  className="hidden"
                onChange={handleFileChange}
                disabled={uploading}
                />
            </div>
          </div>
        </div>
        <div className="abso px-6 pb-6 bg-white">
          <div className="flex flex-col items-center text-center pt-14">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
              {user.full_name || user.email || "User"}
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              {user.role || "No role"}
            </p>
          </div>
        </div>
      </Card>
      <EditProfileModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onProfileUpdated={onProfileUpdated}
      />
      {/* Confirmation dialog for delete avatar */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Avatar</DialogTitle>
          </DialogHeader>
          <div className="py-4">Are you sure you want to delete your avatar?</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              onClick={handleDeleteAvatar}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Confirmation dialog for delete profile */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Profile deletion is not available from the app. Please contact support.
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Close
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}