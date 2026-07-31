import { Request, Response } from 'express'
import { env } from '../config/env.js'

export const getHealthStatus = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    version: '1.0.0',
    environment: env.NODE_ENV,
    uptime: Number(process.uptime().toFixed(2)),
    timestamp: new Date().toISOString(),
  })
}
