import { axiosInstance } from "./axios"

// 🔹 Profile Types
export interface ContractorProfile {
  name: string
  email: string
  phone: string
  address: string
  logo?: string
}

// 🔹 Project Types
export interface Project {
  id: string
  title: string
  description: string
  budget_min: number
  budget_max: number
  deadline: string
}

// 🔹 Contractor Profile CRUD
export async function getContractorProfile(): Promise<ContractorProfile | null> {
  const response = await axiosInstance.get("/api/v1/contractor/contractor/")
  return response.data
}

export async function createContractorProfile(formData: FormData): Promise<void> {
  await axiosInstance.post("/api/v1/contractor/contractor/", formData)
}

export async function updateContractorProfile(formData: FormData): Promise<void> {
  await axiosInstance.patch("/api/v1/contractor/contractor/", formData)
}

// 🔹 Project CRUD
export async function getAllContractorProjects(): Promise<Project[]> {
  const response = await axiosInstance.get("/api/v1/contractor/contractor/projects/")
  return response.data
}

export async function getContractorProjectById(id: string): Promise<Project> {
  const response = await axiosInstance.get(`/api/v1/contractor/contractor/projects/${id}`)
  return response.data
}

export async function createContractorProject(project: Omit<Project, "id">): Promise<void> {
  await axiosInstance.post("/api/v1/contractor/contractor/projects/", project)
}

export async function updateContractorProject(id: string, project: Omit<Project, "id">): Promise<void> {
  await axiosInstance.patch(`/api/v1/contractor/contractor/projects/${id}`, project)
}
