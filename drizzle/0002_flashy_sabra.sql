ALTER TABLE "notes" ADD COLUMN "created_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "notes" DROP COLUMN "context";