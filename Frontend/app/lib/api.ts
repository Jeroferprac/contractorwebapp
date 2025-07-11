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

// ✅ Universal Fetch Helper with Cookie Support
export async function fetchWithAuth<T >(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Get session and token
  const session = await getSession();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (session?.backendAccessToken) {
    headers["Authorization"] = `Bearer ${session.backendAccessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include", // ✅ Always send cookies
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}`);
  }

  return response.json();
}
