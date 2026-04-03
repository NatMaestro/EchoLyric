import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  console.warn('drizzle-kit: DATABASE_URL is not set (required for db:push / migrate)')
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
})
