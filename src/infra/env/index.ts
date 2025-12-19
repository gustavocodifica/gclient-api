import 'dotenv/config'

import { z } from 'zod'
import { logger } from '../logger'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  CLIENT_EMAIL: z.string().email(),
  PRIVATE_KEY: z.string(),
  PROJECT_ID: z.string(),
  JWT_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  logger.error({
    message: 'Invalid environment variables',
    details: _env.error.format(),
  })

  throw new Error('Invalid environment variables')
}

export const env = _env.data
