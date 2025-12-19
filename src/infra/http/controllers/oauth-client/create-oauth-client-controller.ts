import { makeCreateOAuthClient } from '@/infra/factories/oauth-client/make-create-oauth-client'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'

export const createOauthClientController: FastifyPluginAsyncZod = async app => {
  app.post(
    '/oauth',
    {
      schema: {
        hide: true,
        tags: ['OAuth Client'],
        summary: 'Create OAuth Client',
        body: z.object({
          companyId: z.string(),
        }),
        response: {
          201: z.object({
            clientId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { companyId } = request.body

      const createOAuthClientUseCase = makeCreateOAuthClient()

      const { clientId } = await createOAuthClientUseCase.handle({
        companyId,
      })

      return reply.status(201).send({ clientId })
    },
  )
}
