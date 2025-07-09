import { Globe, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CompanyProfile } from "@/store/companyStore";
import { useState } from 'react';
import { CompanyForm } from "./CompanyForm"
import { useCompanyStore } from "@/store/companyStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
// Add status and logo as optional props to extend the existing CompanyProfile type
export interface CompanyProfileWithUIProps extends CompanyProfile {
  logo?: string;
  status?: "active" | "inactive" | "pending";
}

export function CompanyProfileCard({ 
  company, 
  onEdit, 
  onDelete, 
  onView 
}: { 
  company: CompanyProfile | null;
  onEdit?: (company: CompanyProfile) => void;
  onDelete?: (id: string) => void;
  onView?: (company: CompanyProfile) => void;
}) {
  const [showEdit, setShowEdit] = useState(false);
  const updateCompany = useCompanyStore((s) => s.updateCompany);
  const router = useRouter();

  if (!company) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative flex flex-col md:flex-row items-center md:items-start p-6 gap-6 max-w-3xl mx-auto bg-white dark:bg-[#020817]">
      {/* Avatar and left column */}
      <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
        <Avatar className="h-24 w-24 border-2 border-white shadow-md mb-2">
          <AvatarImage src={(company as CompanyProfileWithUIProps).logo || "/placeholder.svg"} alt={company.company_name} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            {company.company_name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="mt-2 text-center md:text-left">
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
            {company.company_name}
          </h3>
          <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">{company.business_license}</Badge>
          </div>
          <p className="text-gray-600 text-sm mt-1 italic">{company.description}</p>
        </div>
      </div>
      {/* Right column: info */}
      <div className="flex-1 flex flex-col gap-3 w-full md:w-2/3">
        {/* Services */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
            <FileText className="h-4 w-4 text-purple-500" />
            Services
          </div>
          <div className="flex flex-wrap gap-2">
            {company.services.map((service, index) => (
              <Badge key={index} className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                {service}
              </Badge>
            ))}
          </div>
        </div>
        {/* Location */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-gray-800 mb-1">
            <MapPin className="h-4 w-4 text-red-500" />
            Location:
          </div>
          <div className="text-gray-700">
            <span className="font-bold">{company.location.city} , {company.location.state}</span>
            <div className="text-xs text-gray-500">
              {company.location.country} • Coordinates: {company.location.coordinates[0]}, {company.location.coordinates[1]}
            </div>
          </div>
        </div>
        {/* Website */}
        {company.website_url && (
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            <a
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {company.website_url}
            </a>
          </div>
        )}
        {/* View Project Button */}
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => router.push('/company/projects')}
            variant="gradient"
          >
            View Project
          </Button>
        </div>
      </div>
      {/* Three dots menu inside the card, top-right */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-2xl text-gray-700 hover:text-purple-600">⋯</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              Edit Profile
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Modal for editing */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Company Profile</DialogTitle>
            <DialogClose asChild>
              <button className="absolute top-2 right-2"></button>
            </DialogClose>
          </DialogHeader>
          <CompanyForm
            initial={company}
            onSubmit={async (data) => {
              await updateCompany(data);
              setShowEdit(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
