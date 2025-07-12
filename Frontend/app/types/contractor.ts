export interface Contractor {
  id: string;
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
    coordinates?: [number, number];
  };
  verified: boolean;
  rating: number;
  total_reviews: number;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category?: string;
  location?: string;
  completion_date?: string;
  project_value?: number;
  status?: string;
  media?: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
  contractor_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  completion_date: string;
  project_value: number;
  status: string;
  media: Array<{
    id: string;
    url: string;
    caption?: string;
  }>;
} 