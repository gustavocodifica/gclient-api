import { logger } from '@/infra/logger'
import { app } from './app'
import { env } from '../env'

app
  .listen({
    port: env.PORT,
  })
  .then(() => logger.info('HTTP server running!'))
