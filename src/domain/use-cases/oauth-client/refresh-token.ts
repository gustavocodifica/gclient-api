import { OAuthClient } from '@/domain/model/oauth-client'
import { OAuthClientRepository } from '@/domain/repositories/oauth-client-repository'
import { app } from '@/infra/http/app'
import { verifyRefreshToken } from '@/infra/utils/verify-refresh-token'

interface RefreshTokenUseCaseRequest {
  refreshToken: string
}

interface RefreshTokenUseCaseResponse {
  oauthClient: OAuthClient
}

export class RefreshTokenUseCase {
  constructor(private oauthClientRespository: OAuthClientRepository) {}

  async handle({
    refreshToken,
  }: RefreshTokenUseCaseRequest): Promise<RefreshTokenUseCaseResponse> {
    const subId = await verifyRefreshToken(refreshToken, app)

    if (!subId) {
      throw new Error('Invalid token error.')
    }

    const oauthClient = await this.oauthClientRespository.findByClientId(subId)

    if (!oauthClient) {
      throw new Error('Resource not found.')
    }

    return {
      oauthClient,
    }
  }
}
