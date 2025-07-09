import { axiosInstance } from "@/lib/api";

export interface ContractorProfile {
  company_name: string;
  email: string;
  phone: string;
  address: string;
  logo?: File | null;
}

export async function getContractorProfile(): Promise<ContractorProfile | null> {
  try {
    const res = await axiosInstance.get("/api/v1/contractor/contractor/");
    return res.data;
  } catch {
    return null;
  }
}

export async function createContractorProfile(data: ContractorProfile) {
  const formData = new FormData();
  formData.append("company_name", data.company_name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  if (data.logo) formData.append("logo", data.logo);
  return axiosInstance.post("/api/v1/contractor/contractor/", formData);
}

export async function updateContractorProfile(data: ContractorProfile) {
  const formData = new FormData();
  formData.append("company_name", data.company_name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  if (data.logo) formData.append("logo", data.logo);
  return axiosInstance.patch("/api/v1/contractor/contractor/", formData);
}
