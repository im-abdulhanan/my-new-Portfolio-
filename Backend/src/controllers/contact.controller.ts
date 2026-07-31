import { Request, Response, NextFunction } from 'express'
import { EmailService } from '../services/email.service.js'
import { sendSuccessResponse } from '../utils/response.js'
import { ContactPayload } from '../types/contact.types.js'
import { logger } from '../utils/logger.js'

const emailService = new EmailService()

export const handleContactSubmission = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contactData = req.body as ContactPayload

    logger.info(
      {
        fullName: contactData.fullName,
        email: contactData.email,
        company: contactData.company,
        projectType: contactData.projectType,
        budget: contactData.budget,
        detailsLength: contactData.projectDetails?.length,
      },
      '📥 Received new contact inquiry submission'
    )

    const result = await emailService.sendContactInquiryEmails(contactData)

    if (!result.adminSent && !result.visitorSent) {
      logger.warn(
        { email: contactData.email },
        '⚠️ Email dispatch failed. Please verify EMAIL_USER/EMAIL_PASS or RESEND_API_KEY in environment variables.'
      )
    }

    sendSuccessResponse(res, 200, 'Thank you. Your inquiry has been received.')
  } catch (err) {
    next(err)
  }
}
