import { Router } from 'express'
import { handleContactSubmission } from '../controllers/contact.controller.js'
import { validateRequest } from '../middleware/validate.middleware.js'
import { antiSpamMiddleware } from '../middleware/antiSpam.middleware.js'
import { contactRateLimiter } from '../middleware/rateLimiter.middleware.js'
import { contactSchema } from '../schemas/contact.schema.js'

export const contactRouter = Router()

contactRouter.post(
  '/api/contact',
  contactRateLimiter,
  antiSpamMiddleware,
  validateRequest(contactSchema),
  handleContactSubmission
)
