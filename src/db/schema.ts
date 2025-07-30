import { boolean, date, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text().notNull().primaryKey(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: text().notNull(),
  name: text().notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
  resetKey: text("reset_key"),
  resetKeyExpires: date("reset_key_expires"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationKey: text("email_verification_key"),
  emailVerificationKeyExpires: date("email_verification_key_expires"),
  isAdmin: boolean("is_admin").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
});
