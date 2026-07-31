import express, { Express, Request, Response } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import pinoHttp from 'pino-http'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'
import { requestIdMiddleware } from './middleware/requestId.middleware.js'
import { globalErrorHandler } from './middleware/errorHandler.middleware.js'
import { appRouter } from './routes/index.js'
import { sendErrorResponse } from './utils/response.js'

export const createApp = (): Express => {
  const app: Express = express()

  // Trust proxy for rate limiting behind load balancers (Railway, Render, Fly.io, Vercel)
  app.set('trust proxy', 1)

  // 1. Security Headers via Helmet
  app.use(helmet())

  // 2. CORS Policy
  const rawCors = env.CORS_ORIGIN || '*'
  const allowedOrigins = rawCors === '*'
    ? '*'
    : rawCors.split(',').map((origin: string) => origin.trim())

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      credentials: true,
    })
  )

  // 3. Response Compression
  app.use(compression())

  // 4. Request ID Assignment
  app.use(requestIdMiddleware)

  // 5. Body Parsing
  app.use(express.json({ limit: '10kb' }))
  app.use(express.urlencoded({ extended: true, limit: '10kb' }))

  // 6. HTTP Logger
  const pinoHttpMiddleware = (pinoHttp as unknown as typeof pinoHttp.default || pinoHttp)({
    logger,
    autoLogging: env.NODE_ENV !== 'test',
    customProps: (req: Request) => ({
      requestId: req.headers['x-request-id'],
    }),
  })
  app.use(pinoHttpMiddleware)

  // 7. Mount Application Routes
  app.use(appRouter)

  // 8. 404 Fallback Handler
  app.use((_req: Request, res: Response) => {
    sendErrorResponse(res, 404, 'Requested endpoint not found')
  })

  // 9. Global Error Handler
  app.use(globalErrorHandler)

  return app
}
