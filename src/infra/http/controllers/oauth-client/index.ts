import { FastifyInstance } from 'fastify'

import { createOauthClientController } from './create-oauth-client-controller'
import { generateTokenController } from './generate-token-controller'
import { refreshTokenController } from './refresh-token-controller'
import { pingController } from './ping-controller'

export function OAuthClientRoutes(app: FastifyInstance) {
  app.register(createOauthClientController, { prefix: '/v1' })
  app.register(generateTokenController, { prefix: '/v1' })
  app.register(refreshTokenController, { prefix: '/v1' })
  app.register(pingController, { prefix: '/v1' })
}
