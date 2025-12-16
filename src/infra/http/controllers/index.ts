import { FastifyInstance } from 'fastify'

import { healthRoute } from './health'
import { pingRoute } from './ping'

export function routes(app: FastifyInstance) {
  app.register(healthRoute, { prefix: '/v1' })
  app.register(pingRoute, { prefix: '/v1' })
}
