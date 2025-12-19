import { db } from '@/infra/db/firestore'

import { FirestoreOAuthClientRepository } from '@/infra/repositories/oauth-client-repository'
import { GenerateTokenUseCase } from '@/domain/use-cases/oauth-client/generate-token'

export function makeGenerateToken() {
  const firestoreOAuthClientRepository = new FirestoreOAuthClientRepository(db)

  const generateTokenUseCase = new GenerateTokenUseCase(
    firestoreOAuthClientRepository,
  )

  return generateTokenUseCase
}
