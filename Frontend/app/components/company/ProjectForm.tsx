"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Calendar, DollarSign, MapPin, Upload, X, ImageIcon, Video, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface MediaItem {
  media_type: "image" | "video" | "document";
  media_data: string; // base64 encoded
  media_mimetype: string;
  caption: string;
  display_order: number;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  completion_date: string;
  project_value: number;
  status: "active" | "completed" | "on-hold" | "cancelled";
  media: MediaItem[];
}

export default function ProjectForm({
  initial,
  onSubmit,
  onCancel,
  loading = false,
}: {
  initial?: Partial<ProjectFormData>;
  onSubmit: (data: ProjectFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: initial?.title || "",
    description: initial?.description || "",
    category: initial?.category || "",
    location: initial?.location || "",
    completion_date: initial?.completion_date || "",
    project_value: initial?.project_value || 0,
    status: initial?.status || "active",
    media: initial?.media || [],
  });

  const [newMediaCaption, setNewMediaCaption] = useState("");

  useEffect(() => {
    if (initial) {
      setFormData({
        title: initial.title || "",
        description: initial.description || "",
        category: initial.category || "",
        location: initial.location || "",
        completion_date: initial.completion_date || "",
        project_value: initial.project_value || 0,
        status: initial.status || "active",
        media: initial.media || [],
      });
    }
  }, [initial]);

  const categories = [
    "Plumbing",
    "Electrical",
    "Renovation",
    "Landscaping",
    "Construction",
    "Interior Design",
    "Roofing",
    "Flooring",
    "Painting",
    "HVAC",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof ProjectFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result as string;
      const base64String = base64Data.split(",")[1];

      let mediaType: "image" | "video" | "document" = "document";
      if (file.type.startsWith("image/")) mediaType = "image";
      else if (file.type.startsWith("video/")) mediaType = "video";

      const newMedia: MediaItem = {
        media_type: mediaType,
        media_data: base64String,
        media_mimetype: file.type,
        caption: newMediaCaption || file.name,
        display_order: formData.media.length + 1,
      };

      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, newMedia],
      }));
      setNewMediaCaption("");
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media
        .filter((_, i) => i !== index)
        .map((item, i) => ({
          ...item,
          display_order: i + 1,
        })),
    }));
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image":
        return <ImageIcon className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020817] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{initial ? "Edit Project" : "Create New Project"}</h1>
          <p className="text-gray-600">{initial ? "Edit project details and media" : "Add a new project with details and media"}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="House Remodel Project"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Category *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Project Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Complete backyard garden overhaul..."
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="Chennai"
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline & Budget */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline & Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="completion_date" className="text-sm font-medium text-gray-700">
                    Completion Date *
                  </Label>
                  <Input
                    id="completion_date"
                    type="date"
                    value={formData.completion_date}
                    onChange={(e) => handleChange("completion_date", e.target.value)}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project_value" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Project Value *
                  </Label>
                  <Input
                    id="project_value"
                    type="number"
                    value={formData.project_value}
                    onChange={(e) => handleChange("project_value", Number.parseInt(e.target.value) || 0)}
                    placeholder="15000"
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Project Media
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Add Media Files</Label>
                <div className="flex gap-2">
                  <Input
                    value={newMediaCaption}
                    onChange={(e) => setNewMediaCaption(e.target.value)}
                    placeholder="Enter caption for the media"
                    className="flex-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
              </div>

              {formData.media.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Uploaded Media</Label>
                  <div className="space-y-2">
                    {formData.media.map((media, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {getMediaIcon(media.media_type)}
                          <div>
                            <p className="font-medium text-gray-900">{media.caption}</p>
                            <p className="text-sm text-gray-500">
                              {media.media_type} • Order: {media.display_order}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1" />
                        <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">{media.media_type}</Badge>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeMedia(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Status Preview */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-teal-600 to-green-600 text-white rounded-t-lg">
              <CardTitle>Project Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusColor(formData.status)}>{formData.status.replace("-", " ")}</Badge>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Project Value</p>
                  <p className="text-lg font-bold text-green-600">${formData.project_value.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Media Files</p>
                  <p className="text-lg font-bold text-blue-600">{formData.media.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" className="px-8 bg-transparent" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={loading}
            >
              {loading ? "Saving..." : initial ? "Update Project" : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 