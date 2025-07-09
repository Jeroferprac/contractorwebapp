import React from "react";
import type { CompanyProject } from "@/store/companyStore";
// import { ProjectCard } from "./ProjectCard"; // To be implemented

export function CompanyProjectsCard({ projects }: { projects: CompanyProject[] }) {
  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-6 shadow-sm text-center text-gray-400">
        No projects found.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Replace below with <ProjectCard project={project} /> when implemented */}
      {projects.map((project, idx) => (
        <div key={idx} className="rounded-xl border bg-white p-4 shadow-sm">
          <h3 className="font-bold text-lg mb-1">{project.title}</h3>
          <div className="text-gray-500 mb-2">{project.description}</div>
          <div className="text-sm text-gray-400 mb-1">Category: {project.category}</div>
          <div className="text-sm text-gray-400 mb-1">Location: {project.location}</div>
          <div className="text-sm text-gray-400 mb-1">Status: {project.status}</div>
          <div className="text-sm text-gray-400 mb-1">Value: ${project.project_value}</div>
          {/* Media and more details to be added */}
        </div>
      ))}
    </div>
  );
}
