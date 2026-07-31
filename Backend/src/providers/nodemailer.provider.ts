import nodemailer, { Transporter } from 'nodemailer'
import { EmailProvider } from './email.provider.js'
import { SendEmailOptions, SendEmailResult } from '../types/email.types.js'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'

export class NodemailerProvider implements EmailProvider {
  private transporter: Transporter

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    })
  }

  async sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const info = await this.transporter.sendMail({
        from: `"${options.subject.includes('Inquiry Received') ? 'Abdul Hanan' : 'Portfolio Inquiry'}" <${env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      })

      logger.info({ messageId: info.messageId }, '✅ Nodemailer SMTP email sent successfully')
      return { success: true, id: info.messageId }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown SMTP email error'
      logger.error({ err }, '❌ Nodemailer SMTP email sending failed')
      return { success: false, error: message }
    }
  }
}
