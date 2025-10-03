ALTER TABLE "users" ADD COLUMN "new_email" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "new_email_verification_key" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "new_email_verification_key_expires" timestamp;