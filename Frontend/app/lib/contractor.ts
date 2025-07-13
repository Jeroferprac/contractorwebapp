// ✅ lib/contractor.ts — All contractor API functions
import { Contractor, Project } from "@/types/contractor";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// Get Contractor Profile (GET)
export async function getContractorProfile(token: string): Promise<Contractor> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch contractor profile");
  return res.json();
}

// Create Contractor Profile (POST)
export async function createContractorProfile(data: Partial<Contractor>, token: string): Promise<Contractor> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error creating contractor profile:", errorText);
    throw new Error(errorText || "Failed to create contractor profile");
  }
  return res.json();
}

// Update Contractor Profile (PATCH)
export async function updateContractorProfile(data: Partial<Contractor>, token: string): Promise<Contractor> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error updating contractor profile:", errorText);
    throw new Error(errorText || "Failed to update contractor profile");
  }
  return res.json();
}

// List all projects for the authenticated contractor (GET)
export async function fetchContractorProjects(token: string): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch contractor projects");
  return res.json();
}

// Create Project (POST)
export async function createContractorProject(data: Partial<Project>, token: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error creating project:", errorText);
    throw new Error(errorText || "Failed to create project");
  }
  return res.json();
}

// Update Project (PATCH)
export async function updateContractorProject(project_id: string, data: Partial<Project>, token: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${project_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Error updating project:", errorText);
    throw new Error(errorText || "Failed to update project");
  }
  return res.json();
}

// Get a specific project by ID (GET)
export async function fetchContractorProject(project_id: string, token: string): Promise<Project> {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${project_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

export async function deleteContractorProject(id: string, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // Log the error response for debugging
    const errorText = await res.text();
    console.error("Delete failed:", errorText);
    throw new Error("Failed to delete project");
  }
}