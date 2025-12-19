import { env } from '@/infra/env'

import admin from 'firebase-admin'

const app = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: env.CLIENT_EMAIL,
    privateKey: env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    projectId: env.PROJECT_ID,
  }),
})

console.log(env.PRIVATE_KEY.replace(/\\n/g, '\n'))

export const db = app.firestore()
