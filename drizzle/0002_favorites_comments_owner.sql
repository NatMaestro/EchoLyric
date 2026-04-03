-- Run after 0001 (or push via drizzle-kit). Adds favorites, comment likes, collection owner.

ALTER TABLE "collections" ADD COLUMN IF NOT EXISTS "owner_user_id" text REFERENCES "users"("id") ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS "user_favorites" (
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "song_id" text NOT NULL REFERENCES "songs"("id") ON DELETE CASCADE,
  PRIMARY KEY ("user_id", "song_id")
);

CREATE TABLE IF NOT EXISTS "comment_likes" (
  "comment_id" text NOT NULL REFERENCES "comments"("id") ON DELETE CASCADE,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  PRIMARY KEY ("comment_id", "user_id")
);
