
import { pgTable, foreignKey, text, timestamp, numeric, unique, varchar, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const events = pgTable("events", {
	id: text().primaryKey().notNull(),
	imageUrl: text("image_url"),
	eventTitle: text("event_title").notNull(),
	eventDate: timestamp("event_date", { mode: 'string' }).notNull(),
	eventDesc: text("event_desc").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	createdBy: text("created_by"),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "events_created_by_users_id_fk"
		}),
]);

export const courses = pgTable("courses", {
	id: text().primaryKey().notNull(),
	courseName: text("course_name").notNull(),
	coursesImage: text("courses_image"),
	courseDescription: text("course_description").notNull(),
	coursePrice: numeric("course_price").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	name: text().notNull(),
	profilePicture: text("profile_picture").default('skibiditoilet').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	resetKey: text("reset_key"),
	resetKeyExpires: timestamp("reset_key_expires", { mode: 'string' }),
	lastReset: timestamp("last_reset", { mode: 'string' }),
	emailVerified: boolean("email_verified").default(false).notNull(),
	emailVerificationKey: text("email_verification_key"),
	emailVerificationKeyExpires: timestamp("email_verification_key_expires", { mode: 'string' }),
	isAdmin: boolean("is_admin").default(false).notNull(),
	isBanned: boolean("is_banned").default(false).notNull(),
	isVerified: boolean("is_verified").notNull().default(false),
	newEmail: varchar("new_email", { length: 255 }),
	newEmailVerificationKey: text("new_email_verification_key"),
	newEmailVerificationKeyExpires: timestamp("new_email_verification_key_expires", { mode: 'string' }),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const customers = pgTable("customers", {
	id: text().primaryKey().notNull(),
	customerName: text("customer_name").notNull(),
	customerEmail: text("customer_email").notNull(),
	courseId: text("course_id").notNull(),
	timePurchased: timestamp("time_purchased", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "customers_course_id_courses_id_fk"
		}),
]);

export const chapters = pgTable("chapters", {
    id: text().primaryKey().notNull(),
    name: text("chapter_name").notNull(),
    location: text("chapter_location").notNull(),
    description: text("description").notNull(),
});
