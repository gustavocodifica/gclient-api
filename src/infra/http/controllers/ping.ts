import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export function pingRoute(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/ping',
    {
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
