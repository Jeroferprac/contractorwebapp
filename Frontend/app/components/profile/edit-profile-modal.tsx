"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Camera, Trash } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/store/authStore";
import { API } from "@/lib/api";
import { useSession } from "next-auth/react";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated: () => void;
}

export function EditProfileModal({
  open,
  onOpenChange,
  onProfileUpdated,
}: EditProfileModalProps) {
  const { toast } = useToast();
  const { data: session } = useSession();
  const backendAccessToken = session?.backendAccessToken;
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    role: "",
  });
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileRes, rolesRes] = await Promise.all([
        axios.get(API.PROFILE, {
          headers: { Authorization: `Bearer ${backendAccessToken}` },
        }),
        axios.get(API.ROLES),
      ]);

      const user = profileRes.data;

      setFormData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        role: user.role || "",
      });
      setAvatarUrl(user.avatar_url || session?.user?.image || "/placeholder.svg");
      setRoles(rolesRes.data ?? []);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load profile or roles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(
        API.UPDATE_PROFILE,
        {
          full_name: formData.full_name,
          phone: formData.phone,
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${backendAccessToken}` },
        }
      );

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
      onProfileUpdated();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      onProfileUpdated();
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload avatar.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteAvatar = async () => {
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
      onProfileUpdated();
      setIsDeleteDialogOpen(false);
      fetchData();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete avatar.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md ">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit Profile
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center pb-2">
              <div className="relative group">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white bg-white object-cover shadow-lg"
                />
                <button
                  type="button"
                  className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow group-hover:opacity-100 opacity-80 transition"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                  title="Upload new avatar"
                >
                  <Camera className="w-5 h-5 text-purple-600" />
                </button>
                {avatarUrl && avatarUrl !== session?.user?.image && avatarUrl !== "/placeholder.svg" && (
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

            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => handleChange("full_name", e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Enter phone"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-gray-500">No roles available</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
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
    </Dialog>
  );
}
