import pino from 'pino'
import { env } from '../env'

const isDev = env.NODE_ENV !== 'production'

export const logger = pino(
  isDev
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {},
)
