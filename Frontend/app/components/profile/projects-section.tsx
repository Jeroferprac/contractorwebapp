import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Technology behind the Blockchain",
    subtitle: "Project #1",
    image: "/placeholder.svg?height=60&width=60",
    link: "See project details",
  },
  {
    id: 2,
    title: "Greatest way to a good Economy",
    subtitle: "Project #2",
    image: "/placeholder.svg?height=60&width=60",
    link: "See project details",
  },
  {
    id: 3,
    title: "Most essential tips for Burnout",
    subtitle: "Project #3",
    image: "/placeholder.svg?height=60&width=60",
    link: "See project details",
  },
]

export function ProjectsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Projects</CardTitle>
        <p className="text-sm text-gray-500">
          Here you can find more details about your projects. Keep you user engaged by providing meaningful information.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="w-15 h-15 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{project.title}</h4>
                <p className="text-sm text-gray-500">{project.subtitle}</p>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  {project.link}
                </a>
              </div>
              <Edit className="h-4 w-4 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
