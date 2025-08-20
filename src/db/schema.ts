import cuid from "cuid";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text().notNull().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  name: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  resetKey: text("reset_key"),
  resetKeyExpires: timestamp("reset_key_expires"),
  lastReset: timestamp("last_reset"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationKey: text("email_verification_key"),
  emailVerificationKeyExpires: timestamp("email_verification_key_expires"),
  isAdmin: boolean("is_admin").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
});

export const eventsTable = pgTable("events", {
  id: text().notNull().primaryKey().$defaultFn(() => cuid()),
  imageUrl: text("image_url"),
  eventTitle: text("event_title").notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventDesc: text("event_desc").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
