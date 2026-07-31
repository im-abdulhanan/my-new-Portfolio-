import { Response } from 'express'
import { ApiResponse } from '../types/contact.types.js'

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  requestId?: string
): Response => {
  const responsePayload: ApiResponse<T> = {
    success: true,
    message,
    requestId: requestId || (res.req.headers['x-request-id'] as string) || undefined,
    timestamp: new Date().toISOString(),
    ...(data !== undefined ? { data } : {}),
  }
  return res.status(statusCode).json(responsePayload)
}

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: Record<string, string[]>,
  requestId?: string
): Response => {
  const responsePayload: ApiResponse = {
    success: false,
    message,
    requestId: requestId || (res.req.headers['x-request-id'] as string) || undefined,
    timestamp: new Date().toISOString(),
    ...(errors ? { errors } : {}),
  }
  return res.status(statusCode).json(responsePayload)
}
