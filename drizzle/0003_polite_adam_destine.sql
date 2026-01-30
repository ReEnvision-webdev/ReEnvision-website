CREATE TABLE "hours" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"activity_name" text NOT NULL,
	"date" timestamp NOT NULL,
	"hours" numeric NOT NULL,
	"reflection" text NOT NULL,
	"approved" boolean,
	"admin_comments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"rated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "hours" numeric DEFAULT '250' NOT NULL;--> statement-breakpoint
ALTER TABLE "hours" ADD CONSTRAINT "hours_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;