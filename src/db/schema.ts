import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  note: text("note").notNull(),
  type: varchar("type", { length: 32 }).notNull(),
  people: text("people").array().default([]),
  place: text("place").array().default([]),
  priority: varchar("priority", { length: 16 }),
  timeRef: timestamp("time_ref", { withTimezone: true }),
  tags: text("tags").array().default([]),
  isDone: boolean("isdone"),
  embedding: real("embedding").array().notNull(),
});
