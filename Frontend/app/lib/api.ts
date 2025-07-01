// lib/api.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

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

const USERS = {
  PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPDATE_PROFILE: `${BASE_URL}/api/v1/users/profile`,
  UPLOAD_AVATAR: `${BASE_URL}/api/v1/users/upload-avatar`,
  DELETE_AVATAR: `${BASE_URL}/api/v1/users/avatar`,
};

const UTILS = {
  HEALTH: `${BASE_URL}/health`,
  ROOT: `${BASE_URL}/`,
};

export const API = {
  ...AUTH,
  ...USERS,
  ...UTILS,
};
