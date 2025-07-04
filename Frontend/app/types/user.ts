export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  role?: string
  avatar?: string
  avatar_url: string | null
  is_verified: boolean
  is_active: boolean
  oauth_provider?: string
  created_at: string
  updated_at: string
  accessToken?: string // only if you're attaching it in frontend
}
