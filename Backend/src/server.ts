import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`)
})

// Graceful Shutdown handling
const handleGracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Initiating graceful shutdown...`)
  server.close(() => {
    logger.info('HTTP server closed. Exiting process.')
    process.exit(0)
  })

  // Force shutdown after 10 seconds if connections refuse to close
  setTimeout(() => {
    logger.error('Could not close connections in time. Forcefully shutting down.')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'))
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'))
