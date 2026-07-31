import { Request, Response, NextFunction } from 'express'
import { sendErrorResponse } from '../utils/response.js'
import { logger } from '../utils/logger.js'

export const antiSpamMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const { website, loadedAt } = req.body

  // 1. Honeypot Field Check: website must be empty or undefined
  if (website && typeof website === 'string' && website.trim().length > 0) {
    logger.warn({ ip: req.ip, website }, '🛡️ Spam detected: Honeypot field filled')
    // Return silent success to trick bots into stopping
    sendErrorResponse(res, 400, 'Invalid request submission')
    return
  }

  // 2. Submission Speed Check: form must take at least 1 second to complete
  if (loadedAt && typeof loadedAt === 'number') {
    const duration = Date.now() - loadedAt
    if (duration < 1000) {
      logger.warn({ ip: req.ip, durationMs: duration }, '🛡️ Spam detected: Instant bot submission')
      sendErrorResponse(res, 400, 'Submission was too fast. Please take your time to fill out details.')
      return
    }
  }

  next()
}
