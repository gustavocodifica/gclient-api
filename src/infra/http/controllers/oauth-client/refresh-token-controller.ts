import { makeRefreshToken } from '@/infra/factories/oauth-client/make-refresh-token'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const refreshTokenController: FastifyPluginAsyncZod = async app => {
  app.post(
    '/oauth/token/refresh',
    {
      schema: {
        tags: ['OAuth Client'],
        summary: 'Refresh token',
        body: z.object({
          refreshToken: z.string(),
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
      const { refreshToken } = request.body

      const refreshTokenUseCase = makeRefreshToken()

      const { oauthClient } = await refreshTokenUseCase.handle({
        refreshToken,
      })

      const newToken = await reply.jwtSign(
        { clientId: oauthClient.clientId, companyId: oauthClient.clientId },
        {
          sign: {
            sub: oauthClient.clientId,
            expiresIn: '1h',
            aud: 'accessToken.GCLient.API',
          },
        },
      )

      const newRefreshToken = await reply.jwtSign(
        {},
        {
          sign: {
            sub: oauthClient.clientId,
            expiresIn: '30d',
            aud: 'refreshToken.GCLient.API',
          },
        },
      )

      return reply.status(201).send({
        token: newToken,
        refreshToken: newRefreshToken,
      })
    },
  )
}
