import { ClientError } from '@/domain/errors/client-error'
import { OAuthClient } from '@/domain/model/oauth-client'
import { OAuthClientRepository } from '@/domain/repositories/oauth-client-repository'

interface GenerateTokenUseCaseRequest {
  clientId: string
}

export class GenerateTokenUseCase {
  constructor(private oauthClientRepository: OAuthClientRepository) {}

  async handle({
    clientId,
  }: GenerateTokenUseCaseRequest): Promise<OAuthClient> {
    const oauthClient =
      await this.oauthClientRepository.findByClientId(clientId)

    if (!oauthClient) {
      throw new ClientError('Resource not found.')
    }

    return oauthClient
  }
}
