import { API } from "./api";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export async function login(data: LoginData) {
  const response = await fetch(API.LOGIN, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  return response.json();
}

export async function register(data: RegisterData) {
  const response = await fetch(API.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Registration failed: ${errorText}`);
  }

  return response.json();
}

export async function logout(token: string) {
  const response = await fetch(API.LOGOUT, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

export async function fetchProfile(token: string) {
  const response = await fetch(API.ME, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}
