import fastify from 'fastify'

import { errorHandler } from './error-handler'

import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'

import { zodToJsonSchema } from 'zod-to-json-schema'

import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { routes } from './controllers'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

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
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Insert the token in the format: Bearer <token>',
        },
      },
    },
  },
  transform: ({ schema, url }) => {
    if (schema && typeof schema === 'object' && 'response' in schema) {
      const responses = schema.response as Record<string, any>

      for (const statusCode of Object.keys(responses)) {
        const zodSchema = responses[statusCode]

        if (
          zodSchema &&
          typeof zodSchema === 'object' &&
          'safeParse' in zodSchema
        ) {
          responses[statusCode] = {
            content: {
              'application/json': {
                schema: zodToJsonSchema(zodSchema),
              },
            },
          }
        }
      }
    }

    return { schema, url }
  },
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setErrorHandler(errorHandler)

app.register(routes)
