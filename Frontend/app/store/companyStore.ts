import { create } from "zustand";
import { API } from "@/lib/api";
import { getSession } from "next-auth/react";

export type CompanyProject = {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completion_date: string;
  project_value: number;
  status: string;
  media: {
    media_type: string;
    media_data: string;
    media_mimetype: string;
    caption: string;
    display_order: number;
  }[];
};

export type CompanyProfile = {
  id?: string;
  profile_type?: string;
  company_name: string;
  business_license: string;
  description: string;
  website_url: string;
  services: string[];
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: [number, number];
  };
  projects?: CompanyProject[];
};

type CompanyState = {
  company: CompanyProfile | null;
  projects: CompanyProject[];
  projectsLoading: boolean;
  fetchCompany: () => Promise<void>;
  createCompany: (data: Partial<CompanyProfile>) => Promise<void>;
  updateCompany: (data: Partial<CompanyProfile>) => Promise<void>;
  fetchProjects: () => Promise<void>;
  createProject: (data: Partial<CompanyProject>) => Promise<void>;
  updateProject: (projectId: string, data: Partial<CompanyProject>) => Promise<void>;
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  company: null,
  projects: [],
  projectsLoading: false,
  fetchCompany: async () => {
    const session = await getSession();
    const res = await fetch(API.COMPANY.PROFILE, {
      headers: { Authorization: `Bearer ${session?.backendAccessToken}` },
    });
    if (res.status === 404) {
      set({ company: null }); // No company profile yet
    } else if (res.ok) {
      set({ company: await res.json() });
    }
  },
  createCompany: async (data) => {
    const session = await getSession();
    const res = await fetch(API.COMPANY.PROFILE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.backendAccessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) set({ company: await res.json() });
  },
  updateCompany: async (data) => {
    const session = await getSession();
    const res = await fetch(API.COMPANY.PROFILE, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.backendAccessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) set({ company: await res.json() });
  },
  fetchProjects: async () => {
    set({ projectsLoading: true });
    const session = await getSession();
    const res = await fetch(API.PROJECTS.LIST, {
      headers: { Authorization: `Bearer ${session?.backendAccessToken}` },
    });
    if (res.ok) {
      set({ projects: await res.json() });
    } else {
      set({ projects: [] });
    }
    set({ projectsLoading: false });
  },
  createProject: async (data) => {
    set({ projectsLoading: true });
    const session = await getSession();
    const res = await fetch(API.PROJECTS.CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.backendAccessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      // Optionally refetch projects or append
      await get().fetchProjects();
    }
    set({ projectsLoading: false });
  },
  updateProject: async (projectId, data) => {
    set({ projectsLoading: true });
    const session = await getSession();
    const res = await fetch(API.PROJECTS.UPDATE(projectId), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.backendAccessToken}`,
      },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      get().fetchProjects();
    }
    set({ projectsLoading: false });
  },
}));
