import { db } from '@/infra/db/firestore'

import { CreateOAuthClientUseCase } from '@/domain/use-cases/oauth-client/create-oauth-client'
import { FirestoreOAuthClientRepository } from '@/infra/repositories/oauth-client-repository'

export function makeCreateOAuthClient() {
  const firestoreOAuthClientRepository = new FirestoreOAuthClientRepository(db)

  const createOAuthClientUseCase = new CreateOAuthClientUseCase(
    firestoreOAuthClientRepository,
  )

  return createOAuthClientUseCase
}
