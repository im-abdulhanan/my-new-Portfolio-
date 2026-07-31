import { EmailProvider } from '../providers/email.provider.js'
import { NodemailerProvider } from '../providers/nodemailer.provider.js'
import { ResendProvider } from '../providers/resend.provider.js'
import { ContactPayload } from '../types/contact.types.js'
import { getAdminNotificationHtml } from '../templates/adminNotification.template.js'
import { getVisitorAutoReplyHtml } from '../templates/visitorAutoReply.template.js'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

export class EmailService {
  private primaryProvider: EmailProvider | null = null
  private fallbackProvider: EmailProvider | null = null

  constructor(provider?: EmailProvider) {
    if (provider) {
      this.primaryProvider = provider
      return
    }

    // Configure Nodemailer (Gmail SMTP) if EMAIL_USER & EMAIL_PASS are set
    if (env.EMAIL_USER && env.EMAIL_PASS) {
      this.primaryProvider = new NodemailerProvider()
    }

    // Configure Resend if RESEND_API_KEY is set
    if (env.RESEND_API_KEY && env.RESEND_API_KEY.startsWith('re_')) {
      if (!this.primaryProvider) {
        this.primaryProvider = new ResendProvider()
      } else {
        this.fallbackProvider = new ResendProvider()
      }
    }

    // Default fallback to NodemailerProvider
    if (!this.primaryProvider) {
      this.primaryProvider = new NodemailerProvider()
    }
  }

  async sendContactInquiryEmails(contactData: ContactPayload): Promise<{ adminSent: boolean; visitorSent: boolean }> {
    const adminHtml = getAdminNotificationHtml(contactData)
    const visitorHtml = getVisitorAutoReplyHtml(contactData.fullName)

    let adminResult = { success: false }
    let visitorResult = { success: false }

    // 1. Send Admin and Visitor emails IN PARALLEL for ultra-fast response time
    if (this.primaryProvider) {
      const [aRes, vRes] = await Promise.all([
        this.primaryProvider.sendEmail({
          to: env.ADMIN_EMAIL,
          subject: `🚀 New Project Inquiry from ${contactData.fullName}`,
          html: adminHtml,
          replyTo: contactData.email,
        }),
        this.primaryProvider.sendEmail({
          to: contactData.email,
          subject: 'Inquiry Received — Abdul Hanan',
          html: visitorHtml,
        }),
      ])
      adminResult = aRes
      visitorResult = vRes
    }

    // 2. Retry any failed email in parallel using fallback provider
    if ((!adminResult.success || !visitorResult.success) && this.fallbackProvider) {
      logger.warn('Primary email provider failed. Attempting fallback provider in parallel...')
      const fallbackTasks: Promise<void>[] = []

      if (!adminResult.success) {
        fallbackTasks.push(
          this.fallbackProvider
            .sendEmail({
              to: env.ADMIN_EMAIL,
              subject: `🚀 New Project Inquiry from ${contactData.fullName}`,
              html: adminHtml,
              replyTo: contactData.email,
            })
            .then((res) => {
              adminResult = res
            })
        )
      }

      if (!visitorResult.success) {
        fallbackTasks.push(
          this.fallbackProvider
            .sendEmail({
              to: contactData.email,
              subject: 'Inquiry Received — Abdul Hanan',
              html: visitorHtml,
            })
            .then((res) => {
              visitorResult = res
            })
        )
      }

      await Promise.all(fallbackTasks)
    }

    logger.info(
      {
        fullName: contactData.fullName,
        email: contactData.email,
        adminSent: adminResult.success,
        visitorSent: visitorResult.success,
      },
      'Contact inquiry email processing completed'
    )

    return {
      adminSent: adminResult.success,
      visitorSent: visitorResult.success,
    }
  }
}
