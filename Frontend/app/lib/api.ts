import { getSession } from "next-auth/react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
console.log(`📡 API Base URL: ${BASE_URL}`);

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

// ✅ Universal Fetch Helper with Cookie Support
export async function fetchWithAuth<T >(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Get session and token
  const session = await getSession();
  console.log('🔐 Session:', session ? 'Found' : 'Not found')
  console.log('🔑 Backend token:', session?.backendAccessToken ? 'Present' : 'Missing')
  
  const baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  let extraHeaders: Record<string, string> = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        extraHeaders[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        extraHeaders[key] = value;
      });
    } else {
      extraHeaders = options.headers as Record<string, string>;
    }
  }

  const headers: Record<string, string> = {
    ...baseHeaders,
    ...extraHeaders,
  };
  if (session?.backendAccessToken) {
    headers["Authorization"] = `Bearer ${session.backendAccessToken}`;
    console.log('✅ Authorization header added')
  } else {
    console.log('❌ No backend token available')
  }

  console.log('🌐 Making request to:', url)
  console.log('📋 Headers:', headers)

  const response = await fetch(url, {
    ...options,
    credentials: "include", // ✅ Always send cookies
    headers,
  });

  console.log('📡 Response status:', response.status)
  console.log('📡 Response ok:', response.ok)

  if (!response.ok) {
    const errorText = await response.text();
    console.log('❌ Error response:', errorText)
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
