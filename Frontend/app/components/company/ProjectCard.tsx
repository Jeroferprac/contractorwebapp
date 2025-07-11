import {
  Calendar,
  DollarSign,
  MapPin,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  ImageIcon,
  Video,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { CompanyProject } from "@/store/companyStore";

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onView,
}: {
  project: CompanyProject;
  onEdit?: (project: CompanyProject) => void;
  onDelete?: (id: string) => void;
  onView?: (project: CompanyProject) => void;
}) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "active": return <Clock className="h-4 w-4" />;
      case "on-hold": return <AlertCircle className="h-4 w-4" />;
      case "cancelled": return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "on-hold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Plumbing: "bg-blue-100 text-blue-800 border-blue-200",
      Electrical: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Renovation: "bg-purple-100 text-purple-800 border-purple-200",
      Landscaping: "bg-green-100 text-green-800 border-green-200",
      Construction: "bg-orange-100 text-orange-800 border-orange-200",
      "Interior Design": "bg-pink-100 text-pink-800 border-pink-200",
      Roofing: "bg-red-100 text-red-800 border-red-200",
      Flooring: "bg-indigo-100 text-indigo-800 border-indigo-200",
      Painting: "bg-cyan-100 text-cyan-800 border-cyan-200",
      HVAC: "bg-teal-100 text-teal-800 border-teal-200",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case "image": return <ImageIcon className="h-3 w-3" />;
      case "video": return <Video className="h-3 w-3" />;
      default: return <FileText className="h-3 w-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const StatusBadge = ({ status }: { status: string }) => (
    <Badge className={`${getStatusColor(status)} rounded-full px-2 py-0.5 text-xs flex items-center gap-1 whitespace-nowrap`}>
      {getStatusIcon(status)}
      {status.replace("-", " ")}
    </Badge>
  );

  const CategoryBadge = ({ category }: { category: string }) => (
    <Badge className={`${getCategoryColor(category)} rounded-full px-2 py-0.5 text-xs flex items-center gap-1 whitespace-nowrap`}>
      {category}
    </Badge>
  );

  return (
    <Card className="border-0 dark:bg-[#020817] shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between w-full">
          <div className="w-full">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
              {project.title}
            </h3>

            <div className="flex flex-wrap gap-1 mt-2">
              <StatusBadge status={project.status} />
              {project.category && <CategoryBadge category={project.category} />}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && <DropdownMenuItem onClick={() => onView(project)}>View Details</DropdownMenuItem>}
              {onEdit && <DropdownMenuItem onClick={() => onEdit(project)}>Edit Project</DropdownMenuItem>}
              {onDelete && <DropdownMenuItem onClick={() => onDelete(project.id)} className="text-red-600 hover:text-red-700">Delete Project</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{project.description}</p>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-2">
          <div className="flex gap-2">
            <MapPin className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-base font-medium text-gray-900">{project.location}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Calendar className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Completion</p>
              <p className="text-base font-medium text-gray-900">{formatDate(project.completion_date)}</p>
            </div>
          </div>

          <div className="flex gap-2 col-span-2">
            <DollarSign className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-gray-500">Project Value</p>
              <p className="text-lg font-bold text-green-600">${project.project_value.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {project.media.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Media Files</span>
              <span className="text-sm text-gray-500">{project.media.length} files</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.media.slice(0, 3).map((media, index) => (
                <Badge
                  key={index}
                  className="bg-gray-100 text-gray-700 border-gray-200 text-xs flex items-center gap-1"
                >
                  {getMediaIcon(media.media_type)}
                  {media.media_type}
                </Badge>
              ))}
              {project.media.length > 3 && (
                <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                  +{project.media.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4 border-t border-gray-100">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-purple-50 hover:border-purple-300 bg-transparent"
              onClick={() => onView(project)}
            >
              View Details
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => onEdit(project)}
            >
              Edit Project
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
