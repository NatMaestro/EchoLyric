CREATE TABLE "collection_songs" (
	"collection_id" text NOT NULL,
	"song_id" text NOT NULL,
	CONSTRAINT "collection_songs_collection_id_song_id_pk" PRIMARY KEY("collection_id","song_id")
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"cover_image" text,
	"created_at" text NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"song_id" text NOT NULL,
	"user_id" text NOT NULL,
	"username" text NOT NULL,
	"avatar" text NOT NULL,
	"text" text NOT NULL,
	"created_at" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contribution_submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "song_lyrics" (
	"song_id" text PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "songs" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"year" integer NOT NULL,
	"genre" text NOT NULL,
	"cover_image" text,
	"has_translation" boolean DEFAULT false NOT NULL,
	"contributions_count" integer DEFAULT 0 NOT NULL,
	"list_position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"avatar" text NOT NULL,
	"contributions" integer DEFAULT 0 NOT NULL,
	"badges" jsonb NOT NULL,
	"joined_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_songs" ADD CONSTRAINT "collection_songs_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_songs" ADD CONSTRAINT "collection_songs_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "song_lyrics" ADD CONSTRAINT "song_lyrics_song_id_songs_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."songs"("id") ON DELETE cascade ON UPDATE no action;