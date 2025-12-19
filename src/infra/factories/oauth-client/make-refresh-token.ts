import { db } from '@/infra/db/firestore'

import { FirestoreOAuthClientRepository } from '@/infra/repositories/oauth-client-repository'
import { RefreshTokenUseCase } from '@/domain/use-cases/oauth-client/refresh-token'

export function makeRefreshToken() {
  const firestoreOAuthClientRepository = new FirestoreOAuthClientRepository(db)

  const refreshTokenUseCase = new RefreshTokenUseCase(
    firestoreOAuthClientRepository,
  )

  return refreshTokenUseCase
}
