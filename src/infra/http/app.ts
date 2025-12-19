import fastify from 'fastify'

import { errorHandler } from './error-handler'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import jwt from '@fastify/jwt'
import cors from '@fastify/cors'

import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'

import { OAuthClientRoutes } from './controllers/oauth-client'
import { env } from '../env'

export const app = fastify()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'G CLIENT API',
      description: 'G CLIENT API Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Insert the token in the format: Bearer <token>',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1h',
  },
})

app.register(cors, {
  origin: '*',
})

app.setErrorHandler(errorHandler)

app.register(OAuthClientRoutes)
