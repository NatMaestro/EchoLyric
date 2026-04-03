ALTER TABLE "contribution_submissions" ADD COLUMN "user_id" text;--> statement-breakpoint
ALTER TABLE "contribution_submissions" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "contribution_submissions" ADD COLUMN "reviewed_by_user_id" text;--> statement-breakpoint
ALTER TABLE "contribution_submissions" ADD COLUMN "reviewed_at" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "github_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "contribution_submissions" ADD CONSTRAINT "contribution_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contribution_submissions" ADD CONSTRAINT "contribution_submissions_reviewed_by_user_id_users_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_github_id_unique" UNIQUE("github_id");