import { OAuthClient } from '@/domain/model/oauth-client'

export abstract class OAuthClientRepository {
  abstract findByClientId(clientId: string): Promise<OAuthClient | null>
  abstract create(oauthClient: Omit<OAuthClient, 'id'>): Promise<string>
}
