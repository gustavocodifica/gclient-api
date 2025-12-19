import crypto from 'node:crypto'
import { OAuthClientRepository } from '@/domain/repositories/oauth-client-repository'

interface CreateOAuthClientUseCaseRequest {
  companyId: string
}

interface CreateOAuthClientUseCaseResponse {
  clientId: string
}

export class CreateOAuthClientUseCase {
  constructor(private oauthClientRespository: OAuthClientRepository) {}

  async handle({
    companyId,
  }: CreateOAuthClientUseCaseRequest): Promise<CreateOAuthClientUseCaseResponse> {
    const clientId = await this.oauthClientRespository.create({
      clientId: crypto.randomUUID(),
      companyId,
    })

    return {
      clientId,
    }
  }
}
