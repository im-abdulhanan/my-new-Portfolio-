import { z } from 'zod'

export const contactSchema = z.object({
  fullName: z
    .string({ required_error: 'Full Name is required' })
    .trim()
    .min(2, 'Full Name must be at least 2 characters')
    .max(100, 'Full Name cannot exceed 100 characters'),

  email: z
    .string({ required_error: 'Email Address is required' })
    .trim()
    .email('Invalid Email Address'),

  company: z
    .string()
    .trim()
    .max(100, 'Company name cannot exceed 100 characters')
    .optional(),

  projectType: z
    .string({ required_error: 'Project Type is required' })
    .trim()
    .min(2, 'Please select a valid Project Type'),

  budget: z.string().trim().optional(),

  projectDetails: z
    .string({ required_error: 'Project Details is required' })
    .trim()
    .min(10, 'Project Details must be at least 10 characters')
    .max(5000, 'Project Details cannot exceed 5000 characters'),

  // Honeypot field (must be empty string)
  website: z.string().optional(),

  // Timestamp captured on dialog mount (used for anti-spam check)
  loadedAt: z.number().optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
