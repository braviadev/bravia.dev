import type { NextRequest } from 'next/server'

import { betterAuth, type SocialProviders } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { db } from '@/db'
import { env } from '@/lib/env'

function getSocialProviders(): SocialProviders {
  const providers: SocialProviders = {}

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }
  }

  if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }
  }

  return providers
}

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL,

  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),

  trustedOrigins: [
    process.env.NEXT_PUBLIC_SITE_URL!,
    "https://xn--brava-2sa.com",
    "https://www.xn--brava-2sa.com"
  ],

  socialProviders: getSocialProviders(),

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        input: false,
        defaultValue: 'user',
      },
    },
  },
})

export async function getSession(request?: NextRequest) {
  return auth.api.getSession({
    headers: request ? request.headers : await headers(),
  })
}
