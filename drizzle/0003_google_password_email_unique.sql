-- Optional manual migration. Prefer `npx drizzle-kit push` to sync schema.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "google_id" text;
CREATE UNIQUE INDEX IF NOT EXISTS "users_google_id_unique" ON "users" ("google_id") WHERE "google_id" IS NOT NULL;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password_hash" text;
