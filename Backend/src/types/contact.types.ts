export interface ContactPayload {
  fullName: string
  email: string
  company?: string
  projectType: string
  budget?: string
  projectDetails: string
  website?: string
  loadedAt?: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  requestId?: string
  timestamp: string
  data?: T
  errors?: Record<string, string[]>
}
