import { Globe, MapPin, FileText, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CompanyProfile } from "@/store/companyStore";

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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white shadow-md">
              <AvatarImage src={(company as CompanyProfileWithUIProps).logo || "/placeholder.svg"} alt={company.company_name} />
              <AvatarFallback className="text-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {company.company_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {company.company_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">{company.business_license}</Badge>
                {(company as CompanyProfileWithUIProps).status && 
                  <Badge className={getStatusColor((company as CompanyProfileWithUIProps).status!)}>
                    {(company as CompanyProfileWithUIProps).status}
                  </Badge>
                }
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && <DropdownMenuItem onClick={() => onView(company)}>View Details</DropdownMenuItem>}
              {onEdit && <DropdownMenuItem onClick={() => onEdit(company)}>Edit Company</DropdownMenuItem>}
              {onDelete && company.id && 
                <DropdownMenuItem onClick={() => onDelete(company.id!)} className="text-red-600 hover:text-red-700">
                  Delete Company
                </DropdownMenuItem>
              }
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{company.description}</p>

        {/* Services */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-gray-700">Services</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {company.services.slice(0, 3).map((service, index) => (
              <Badge key={index} className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                {service}
              </Badge>
            ))}
            {company.services.length > 3 && (
              <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                +{company.services.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-gray-600">Location:</span>
            <span className="font-medium text-gray-900">
              {company.location.city}, {company.location.state}
            </span>
          </div>
          <div className="text-xs text-gray-500 ml-6">
            {company.location.country} • Coordinates: {company.location.coordinates[0]},{" "}
            {company.location.coordinates[1]}
          </div>
        </div>

        {/* Website */}
        {company.website_url && (
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-blue-500" />
            <a
              href={company.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline truncate"
            >
              {company.website_url}
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
              onClick={() => onView(company)}
            >
              View Profile
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => onEdit(company)}
            >
              Edit Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
