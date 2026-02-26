import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  real,
  integer,
} from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  userId: text("user_id").notNull(),
  note: text("note").notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  people: text("people").array().default([]),
  place: text("place").array().default([]),
  priority: varchar("priority", { length: 16 }),
  timeRef: timestamp("time_ref", { withTimezone: true }),
  dueDate: timestamp("due_date", { withTimezone: true }),
  tags: text("tags").array().default([]),
  isDone: boolean("isdone"),
  category: varchar("category", { length: 32 }),
  urgency: varchar("urgency", { length: 16 }),
  status: varchar("status", { length: 16 }).default("active"),
  sentiment: varchar("sentiment", { length: 16 }),
  source: varchar("source", { length: 32 }).default("manual"),
  relatedNoteIds: integer("related_note_ids").array().default([]),
  embedding: real("embedding").array().notNull(),
});

export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  userId: text("user_id").notNull(),
  query: text("query").notNull(),
  report: text("report").notNull(),
});
