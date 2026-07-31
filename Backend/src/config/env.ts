import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  CLIENT_URL: z.string().default('https://my-new-portfolio-gold.vercel.app'),
  CORS_ORIGIN: z.string().default('*'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASS: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  ADMIN_EMAIL: z.string().default('abdulhanan.microsoft@gmail.com'),
  SENDER_EMAIL: z.string().default('abdulhanan.microsoft@gmail.com'),
})

const parseEnv = () => {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    console.error('❌ Environment validation failed:', JSON.stringify(result.error.format(), null, 2))
    throw new Error('Invalid environment variables')
  }
  return result.data
}

export const env = parseEnv()
