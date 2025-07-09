import axios from "axios"

// ✅ Axios instance for API calls
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  withCredentials: true, // Cookie-based auth
})

// ✅ Interceptors for error logging
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Properly extract and log useful error info
    const status = error.response?.status
    const message = error.response?.data?.detail || error.message || "Unknown error"

    console.error("❌ API Error:", {
      status,
      message,
      data: error.response?.data,
      url: error.config?.url,
    })

    return Promise.reject(error)
  }
)

// Base URL (for raw string construction)
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"

// Endpoint constants
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
}

const USERS = {
  PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPLOAD_AVATAR: `${BASE_URL}/api/v1/users/upload-avatar`,
  DELETE_AVATAR: `${BASE_URL}/api/v1/users/avatar`,
}

const QUOTATION = {
  CREATE: `${BASE_URL}/api/v1/quotation/quote`,
  LIST: `${BASE_URL}/api/v1/quotation/quotes`,
}

const CONTRACTOR = {
  BASE: `${BASE_URL}/api/v1/contractor/contractor/`,
  PROJECTS: {
    BASE: `${BASE_URL}/api/v1/contractor/contractor/projects/`,
    BY_ID: (id: string) => `${BASE_URL}/api/v1/contractor/contractor/projects/${id}`,
  },
}

const UTILS = {
  HEALTH: `${BASE_URL}/health`,
  ROOT: `${BASE_URL}/`,
}

export const API = {
  AUTH,
  USERS,
  QUOTATION,
  CONTRACTOR,
  UTILS,
}
