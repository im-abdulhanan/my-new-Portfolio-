import rateLimit from 'express-rate-limit'
import { sendErrorResponse } from '../utils/response.js'

// Strict rate limiting: Max 5 submissions per 15 minutes per IP
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    sendErrorResponse(
      res,
      429,
      'Too many contact requests from this IP. Please try again after 15 minutes.'
    )
  },
})
