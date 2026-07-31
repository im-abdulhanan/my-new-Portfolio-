import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { sendErrorResponse } from '../utils/response.js'

export const validateRequest = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body)
      next()
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string[]> = {}

        err.errors.forEach((issue) => {
          const field = issue.path.join('.') || 'general'
          if (!formattedErrors[field]) {
            formattedErrors[field] = []
          }
          formattedErrors[field].push(issue.message)
        })

        sendErrorResponse(res, 400, 'Validation failed. Please check your inputs.', formattedErrors)
        return
      }

      next(err)
    }
  }
}
