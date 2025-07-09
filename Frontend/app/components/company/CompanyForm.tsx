import React, { useState, useEffect } from "react";
import { Building2, MapPin, Globe, FileText, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { CompanyProfile } from "@/store/companyStore";

const defaultLocation = { city: "", state: "", country: "", coordinates: [0, 0] as [number, number] };

export function CompanyForm({
  initial,
  onSubmit,
  loading = false,
}: {
  initial?: Partial<CompanyProfile>;
  onSubmit: (data: Partial<CompanyProfile>) => void;
  loading?: boolean;
}) {
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    ...initial,
    location: {
      city: initial?.location?.city ?? "",
      state: initial?.location?.state ?? "",
      country: initial?.location?.country ?? "",
      coordinates: initial?.location?.coordinates ?? [0, 0],
    },
    services: initial?.services || [],
  });
  const [newService, setNewService] = useState("");

  // If editing, update formData when initial changes
  useEffect(() => {
    setFormData({
      ...initial,
      location: {
        city: initial?.location?.city ?? "",
        state: initial?.location?.state ?? "",
        country: initial?.location?.country ?? "",
        coordinates: initial?.location?.coordinates ?? [0, 0],
      },
      services: initial?.services || [],
    });
  }, [initial]);

  const handleChange = (field: string, value: any) => {
    if (field.startsWith("location.")) {
      const locationField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          city: locationField === "city" ? value ?? "" : prev.location?.city ?? "",
          state: locationField === "state" ? value ?? "" : prev.location?.state ?? "",
          country: locationField === "country" ? value ?? "" : prev.location?.country ?? "",
          coordinates: prev.location?.coordinates ?? [0, 0],
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addService = () => {
    if (newService.trim() && !formData.services?.includes(newService.trim())) {
      setFormData((prev) => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()],
      }));
      setNewService("");
    }
  };

  const removeService = (serviceToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      services: (prev.services || []).filter((service) => service !== serviceToRemove),
    }));
  };

  const handleCoordinatesChange = (index: number, value: string) => {
    const numValue = Number.parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        city: prev.location?.city ?? "",
        state: prev.location?.state ?? "",
        country: prev.location?.country ?? "",
        coordinates: prev.location?.coordinates
          ? prev.location.coordinates.map((coord, i) => (i === index ? numValue : coord)) as [number, number]
          : [0, 0],
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-sm font-medium text-gray-700">
                    Company Name *
                  </Label>
                  <Input
                    id="company_name"
                    value={formData.company_name || ""}
                    onChange={(e) => handleChange("company_name", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_license" className="text-sm font-medium text-gray-700">
                    Business License *
                  </Label>
                  <Input
                    id="business_license"
                    value={formData.business_license || ""}
                    onChange={(e) => handleChange("business_license", e.target.value)}
                    placeholder="REG-2025-XYZR"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe your company's services and mission..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Website URL
                </Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url || ""}
                  onChange={(e) => handleChange("website_url", e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Add Services</Label>
                <div className="flex gap-2">
                  <Input
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    placeholder="Enter service name"
                    className="flex-1"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addService())}
                  />
                  <Button type="button" onClick={addService} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {formData.services && formData.services.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Current Services</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service, index) => (
                      <Badge
                        key={index}
                        className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition-colors"
                      >
                        {service}
                        <button
                          type="button"
                          onClick={() => removeService(service)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    value={formData.location?.city || ""}
                    onChange={(e) => handleChange("location.city", e.target.value)}
                    placeholder="Chennai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State *
                  </Label>
                  <Input
                    id="state"
                    value={formData.location?.state || ""}
                    onChange={(e) => handleChange("location.state", e.target.value)}
                    placeholder="Tamil Nadu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country *
                  </Label>
                  <Input
                    id="country"
                    value={formData.location?.country || ""}
                    onChange={(e) => handleChange("location.country", e.target.value)}
                    placeholder="India"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Coordinates (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="latitude" className="text-xs text-gray-500">
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.location?.coordinates?.[0] ?? ""}
                      onChange={(e) => handleCoordinatesChange(0, e.target.value)}
                      placeholder="11.0168"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="longitude" className="text-xs text-gray-500">
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.location?.coordinates?.[1] ?? ""}
                      onChange={(e) => handleCoordinatesChange(1, e.target.value)}
                      placeholder="76.9558"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="submit" className="px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" disabled={loading}>
              {loading ? "Saving..." : initial ? "Update Company" : "Create Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}