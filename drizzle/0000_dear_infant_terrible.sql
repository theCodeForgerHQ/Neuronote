CREATE TABLE "notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"note" text NOT NULL,
	"type" varchar(32) NOT NULL,
	"people" text[] DEFAULT '{}',
	"place" text[] DEFAULT '{}',
	"priority" varchar(16),
	"time_ref" timestamp with time zone,
	"context" text,
	"tags" text[] DEFAULT '{}',
	"isdone" boolean,
	"embedding" real[] NOT NULL
);
