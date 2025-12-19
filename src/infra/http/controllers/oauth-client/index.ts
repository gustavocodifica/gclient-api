import { FastifyInstance } from 'fastify'

import { verifyJWT } from '@/infra/middlewares'

import { createOauthClientController } from './create-oauth-client-controller'
import { generateTokenController } from './generate-token-controller'
import { refreshTokenController } from './refresh-token-controller'

export function OAuthClientRoutes(app: FastifyInstance) {
  app.register(createOauthClientController, { prefix: '/v1' })
  app.register(generateTokenController, { prefix: '/v1' })
  app.register(refreshTokenController, { prefix: '/v1' })

  app.get('/ping', { onRequest: verifyJWT }, async (request, reply) => {
    return reply.send({ message: 'pong' })
  })
}
