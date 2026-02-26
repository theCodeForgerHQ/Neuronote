CREATE TABLE "summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"user_id" text NOT NULL,
	"query" text NOT NULL,
	"report" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "due_date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "category" varchar(32);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "urgency" varchar(16);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "status" varchar(16) DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "sentiment" varchar(16);--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "source" varchar(32) DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "related_note_ids" integer[] DEFAULT '{}';