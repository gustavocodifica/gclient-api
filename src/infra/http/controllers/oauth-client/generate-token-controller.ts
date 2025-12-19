import { makeGenerateToken } from '@/infra/factories/oauth-client/make-generate-token'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import z from 'zod'

export const generateTokenController: FastifyPluginAsyncZod = async app => {
  app.post(
    '/oauth/token',
    {
      schema: {
        tags: ['OAuth Client'],
        summary: 'Generate token',
        body: z.object({
          clientId: z.string(),
        }),
        response: {
          201: z.object({
            token: z.jwt(),
            refreshToken: z.jwt(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { clientId } = request.body

      const generateTokenUseCase = makeGenerateToken()

      const oauthClient = await generateTokenUseCase.handle({
        clientId,
      })

      const token = await reply.jwtSign(
        { clientId: oauthClient.clientId, companyId: oauthClient.clientId },
        {
          sign: {
            sub: oauthClient.clientId,
            expiresIn: '1h',
            aud: 'accessToken.GCLient.API',
          },
        },
      )

      const refreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: oauthClient.clientId,
            expiresIn: '30d',
            aud: 'refreshToken.GCLient.API',
          },
        },
      )

      return reply.status(201).send({ token, refreshToken })
    },
  )
}
