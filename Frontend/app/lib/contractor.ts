export interface ContractorProfile {
  company_name: string;
  address: string;
  phone_number: string;
  logo?: File | null;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const fetchContractorProfile = async (): Promise<ContractorProfile | null> => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    credentials: "include",
  });
  if (!res.ok) return null;
  return res.json();
};

export const saveContractorProfile = async (data: FormData) => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
};

export const updateContractorProfile = async (data: FormData) => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: "PATCH",
    credentials: "include",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};

export const fetchProjectById = async (projectId: string): Promise<Project> => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${projectId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
};

export const createProject = async (data: FormData) => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    method: "POST",
    credentials: "include",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to create project");
  return res.json();
};

export const updateProject = async (projectId: string, data: FormData) => {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${projectId}`, {
    method: "PATCH",
    credentials: "include",
    body: data,
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
};
