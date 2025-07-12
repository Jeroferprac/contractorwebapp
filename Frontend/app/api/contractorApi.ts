// Contractor API functions

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Get Contractor Profile
export async function getContractorProfile(token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch contractor profile');
  return res.json();
}

// Create Contractor Profile
export async function createContractorProfile(data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create contractor profile');
  return res.json();
}

// Update Contractor Profile
export async function updateContractorProfile(data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update contractor profile');
  return res.json();
}

// List all projects for the authenticated contractor
export async function getContractorProjects(token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

// Create Project
export async function createProject(data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create project');
  return res.json();
}

// Update Project
export async function updateProject(projectId: string, data: any, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${projectId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

// Get a specific project by ID
export async function getProjectById(projectId: string, token: string) {
  const res = await fetch(`${API_BASE}/api/v1/contractor/contractor/projects/${projectId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to fetch project');
  return res.json();
} 