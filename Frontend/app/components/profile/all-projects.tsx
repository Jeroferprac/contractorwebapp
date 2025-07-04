import { Edit } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "Technology behind the Blockchain",
    subtitle: "Project #1",
    link: "See project details",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Greatest way to a good Economy",
    subtitle: "Project #2",
    link: "See project details",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    title: "Most essential tips for Burnout",
    subtitle: "Project #3",
    link: "See project details",
    image: "/placeholder.svg?height=60&width=60",
  },
]

export function AllProjects() {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">All Projects</h3>
      <p className="text-gray-400 text-sm mb-4 lg:mb-6 leading-relaxed">
        Here you can find more details about your projects. Keep you user engaged by providing meaningful information.
      </p>

      <div className="space-y-3 lg:space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center space-x-3 lg:space-x-4 group">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm lg:text-base mb-1 line-clamp-2">{project.title}</h4>
              <p className="text-xs text-gray-400 mb-1">{project.subtitle}</p>
              <button className="text-xs text-purple-600 hover:text-purple-700 font-medium">{project.link}</button>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
