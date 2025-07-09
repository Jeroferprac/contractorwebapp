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
  fetchCompany: () => Promise<void>;
  createCompany: (data: Partial<CompanyProfile>) => Promise<void>;
  updateCompany: (data: Partial<CompanyProfile>) => Promise<void>;
};

export const useCompanyStore = create<CompanyState>((set) => ({
  company: null,
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
}));
