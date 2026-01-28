CREATE TABLE "chapters" (
	"id" text PRIMARY KEY NOT NULL,
	"chapter_name" text NOT NULL,
	"chapter_location" text NOT NULL,
	"description" text NOT NULL,
	"chapter website" text
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_verified" boolean DEFAULT false NOT NULL;