import { verifyJWT } from '@/infra/middlewares'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'

export const pingController: FastifyPluginAsyncZod = async app => {
  app.get(
    '/ping',
    {
      onRequest: verifyJWT,
      schema: {
        tags: ['Ping'],
        summary: 'Ping',
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.send({ message: 'Pong' })
    },
  )
}
