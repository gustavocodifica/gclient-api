import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import z from 'zod'

export function healthRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/health',
    {
      schema: {
        tags: ['Healt Check'],
        summary: 'Health Check',
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      return reply.send({ message: 'Healthy' })
    },
  )
}
