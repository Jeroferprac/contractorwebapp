import { getSession } from "next-auth/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// 🔐 Authentication APIs
const AUTH = {
  REGISTER: `${BASE_URL}/api/v1/auth/register`,
  LOGIN: `${BASE_URL}/api/v1/auth/login`,
  LOGOUT: `${BASE_URL}/api/v1/auth/logout`,
  ME: `${BASE_URL}/api/v1/auth/me`,
  ROLES: `${BASE_URL}/api/v1/auth/roles`,
  REFRESH: `${BASE_URL}/api/v1/auth/refresh`,
  OAUTH: (provider: string, redirectUri: string) =>
    `${BASE_URL}/api/v1/auth/oauth/${provider}?redirect_uri=${redirectUri}`,
  OAUTH_CALLBACK: (provider: string, code: string, redirectUri: string) =>
    `${BASE_URL}/api/v1/auth/oauth/${provider}/callback?provider=${provider}&code=${code}&redirect_uri=${redirectUri}`,
};

// 👤 User APIs
const USERS = {
  PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPLOAD_AVATAR: `${BASE_URL}/api/v1/users/upload-avatar`,
  DELETE_AVATAR: `${BASE_URL}/api/v1/users/avatar`,
};

// 📄 Quotation APIs
const QUOTATION = {
  QUOTE: `${BASE_URL}/api/v1/quotation/quote`,
  QUOTES: `${BASE_URL}/api/v1/quotation/quotes`,
};

// 🏢 Contractor APIs
const CONTRACTOR = {
  BASE: `${BASE_URL}/api/v1/contractor/contractor/`,
};

// ⚙️ Utility APIs
const UTILS = {
  HEALTH: `${BASE_URL}/health`,
  ROOT: `${BASE_URL}/`,
};

const COMPANY = {
  PROFILE: `${BASE_URL}/api/v1/company/company/`,
};

const PROJECTS = {
  LIST: `${BASE_URL}/api/v1/company/company/projects/`,
  CREATE: `${BASE_URL}/api/v1/company/company/projects/`,
  DETAIL: (projectId: string) => `${BASE_URL}/api/v1/company/company/projects/${projectId}`,
  UPDATE: (projectId: string) => `${BASE_URL}/api/v1/company/company/projects/${projectId}`,
};

export const API = {
  ...AUTH,
  ...USERS,
  ...QUOTATION,
  ...UTILS,
  COMPANY,
  CONTRACTOR,
  PROJECTS,
};

// API Client for making authenticated requests to Next.js API routes
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Get session and token
    const session = await getSession();
    const token = session?.user?.backendToken;
    
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Use relative URL for Next.js API routes
    const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    try {
      console.log('API Client: Making request to:', url);
      console.log('API Client: Request config:', {
        method: config.method,
        headers: config.headers,
        body: config.body
      });
      
      const response = await fetch(url, config);
      
      // Handle authentication errors
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Client: Error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        
        // Provide more detailed error information
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Use empty string as base URL for Next.js API routes
export const apiClient = new ApiClient("");
export const { get, post, put, delete: del, patch } = apiClient;
