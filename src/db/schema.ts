import cuid from "cuid";
import {
  boolean,
  timestamp,
  pgTable,
  text,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").notNull().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
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
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => cuid()),
  imageUrl: text("image_url"),
  eventTitle: text("event_title").notNull(),
  eventDate: timestamp("event_date").notNull(),
  eventDesc: text("event_desc").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: text("created_by").references(() => usersTable.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const coursesTable = pgTable("courses", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => cuid()),
  course_name: text("course_name").notNull(),
  courses_image: text("courses_image"),
  course_description: text("course_description").notNull(),
  course_price: numeric("course_price").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const customersTable = pgTable("customers", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => cuid()),
  customer_name: text("customer_name").notNull(),
  customer_email: text("customer_email").notNull(),
  course_id: text("course_id").references(() => coursesTable.id),
  time_purchased: timestamp("time_purchased", { withTimezone: true }).notNull().defaultNow(),
});
