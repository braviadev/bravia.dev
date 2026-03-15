import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { IS_PRODUCTION } from '@/lib/constants'
import { env } from '@/lib/env'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

let client: ReturnType<typeof postgres>

const connectionConfig = {
  max: 1, // important: limit connections
  idle_timeout: 20,
  connect_timeout: 10
}

if (IS_PRODUCTION) {
  client = postgres(env.DATABASE_URL, connectionConfig)
} else {
  globalThis.pgClient ??= postgres(env.DATABASE_URL, connectionConfig)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })
