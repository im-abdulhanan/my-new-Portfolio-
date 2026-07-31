import { Request, Response, NextFunction } from 'express'
import { env } from '../config/env.js'
import { logger } from '../utils/logger.js'
import { sendErrorResponse } from '../utils/response.js'

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): Response => {
  logger.error({ err: err.stack || err.message }, 'Unhandled application error')

  const statusCode = (err as unknown as { statusCode?: number }).statusCode || 500
  const message = env.NODE_ENV === 'production' && statusCode === 500
    ? 'An unexpected server error occurred. Please try again later.'
    : err.message

  return sendErrorResponse(res, statusCode, message)
}
