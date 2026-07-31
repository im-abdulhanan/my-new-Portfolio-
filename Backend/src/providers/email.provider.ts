import { SendEmailOptions, SendEmailResult } from '../types/email.types.js'

export interface EmailProvider {
  sendEmail(options: SendEmailOptions): Promise<SendEmailResult>
}
