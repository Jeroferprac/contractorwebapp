// ✅ lib/contractor.ts — All contractor API functions
import { API, fetchWithAuth } from "./api";

export interface ContractorProfile {
  id?: string;
  user_id?: string;
  company_name: string;
  profile_type: "contractor" | "company";
  business_license?: string;
  description?: string;
  website_url?: string;
  services?: string[];
  location?: {
    city?: string;
    state?: string;
    country?: string;
    [key: string]: any;
  };
  verified?: boolean;
  rating?: number;
  total_reviews?: number;
  created_at?: string;
  updated_at?: string;
  projects?: any[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  attachment_url?: string;
}

// Contractor Profile
export async function getContractorProfile(): Promise<ContractorProfile> {
  return fetchWithAuth(API.CONTRACTOR.BASE);
}

export async function createContractorProfile(data: ContractorProfile): Promise<ContractorProfile> {
  return fetchWithAuth(API.CONTRACTOR.BASE, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateContractorProfile(data: ContractorProfile): Promise<ContractorProfile> {
  return fetchWithAuth(API.CONTRACTOR.BASE, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

// Contractor Projects
export async function getContractorProjects(): Promise<Project[]> {
  return fetchWithAuth(API.CONTRACTOR.BASE + "projects/");
}

export async function createContractorProject(data: any): Promise<Project> {
  return fetchWithAuth(API.CONTRACTOR.BASE + "projects/", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getContractorProjectById(projectId: string): Promise<Project> {
  return fetchWithAuth(API.CONTRACTOR.BASE + `projects/${projectId}`);
}

export async function updateContractorProject(projectId: string, data: any): Promise<Project> {
  return fetchWithAuth(API.CONTRACTOR.BASE + `projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
