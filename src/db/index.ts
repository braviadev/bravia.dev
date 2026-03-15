import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { IS_PRODUCTION } from '@/lib/constants'
import { env } from '@/lib/env'

import * as schema from './schemas'

declare global {
  var pgClient: ReturnType<typeof postgres> | undefined
}

const connectionOptions = {
  max: 1,              // VERY important
  idle_timeout: 20,
  connect_timeout: 10,
}

let client: ReturnType<typeof postgres>

if (IS_PRODUCTION) {
  client = postgres(env.DATABASE_URL, connectionOptions)
} else {
  globalThis.pgClient ??= postgres(env.DATABASE_URL, connectionOptions)
  client = globalThis.pgClient
}

export const db = drizzle(client, { schema })
