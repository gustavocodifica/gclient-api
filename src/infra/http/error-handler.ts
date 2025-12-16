import { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'
import { logger } from '../logger'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  logger.error({
    details: error,
  })

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input.',
      errors: error.flatten().fieldErrors,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
    error,
  })
}
