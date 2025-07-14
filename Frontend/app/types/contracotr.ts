export interface Contractor {
    id: string;
    company_name: string;
    profile_type: string;
    business_license: string;
    description: string;
    website_url: string;
    services: string[];
    location: {
      city?: string;
      state?: string;
      country?: string;
      coordinates?: [number, number];
    };
    verified: boolean;
    rating: number;
    total_reviews: number;
    email: string;
    // Add any other fields your backend expects
  } 