import { Resend } from 'resend'
import { EmailProvider } from './email.provider.js'
import { SendEmailOptions, SendEmailResult } from '../types/email.types.js'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

export class ResendProvider implements EmailProvider {
  private resend: Resend

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY)
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: env.SENDER_EMAIL,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      })

      if (error) {
        logger.error({ error }, '❌ Resend provider failed to send email')
        return { success: false, error: error.message }
      }

      logger.info({ id: data?.id }, '✅ Resend email sent successfully')
      return { success: true, id: data?.id }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown email sending error'
      logger.error({ err }, '❌ Resend provider error')
      return { success: false, error: message }
    }
  }
}
