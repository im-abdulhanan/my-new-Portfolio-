import { Router } from 'express'
import { healthRouter } from './health.routes.js'
import { contactRouter } from './contact.routes.js'

export const appRouter = Router()

appRouter.use(healthRouter)
appRouter.use(contactRouter)
