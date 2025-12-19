import { OAuthClient } from '@/domain/model/oauth-client'
import { OAuthClientRepository } from '@/domain/repositories/oauth-client-repository'

import { Firestore } from 'firebase-admin/firestore'

export class FirestoreOAuthClientRepository implements OAuthClientRepository {
  constructor(private firestore: Firestore) {}

  private FB_OAUTHCLIENT_COLLECTION = 'apiClients'

  async findByClientId(clientId: string) {
    const response = await this.firestore
      .collection(this.FB_OAUTHCLIENT_COLLECTION)
      .where('clientId', '==', clientId)
      .limit(1)
      .get()

    if (response.empty) {
      return null
    }

    const doc = response.docs[0]

    const oauthClient = {
      id: doc.id,
      ...(doc.data() as Omit<OAuthClient, 'id'>),
    }

    return oauthClient
  }

  async create(oauthClient: Omit<OAuthClient, 'id'>): Promise<string> {
    const response = await this.firestore
      .collection(this.FB_OAUTHCLIENT_COLLECTION)
      .add({
        clientId: oauthClient.clientId,
        companyId: oauthClient.companyId,
        createdAt: oauthClient.createdAt ?? new Date().toISOString(),
      })

    return response.id
  }
}
