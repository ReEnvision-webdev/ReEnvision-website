import { pgTable, foreignKey, text, timestamp, unique, varchar, boolean } from "drizzle-orm/pg-core"
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

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	password: text().notNull(),
	name: text().notNull(),
	resetKey: text("reset_key"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	resetKeyExpires: timestamp("reset_key_expires", { mode: 'string' }),
	emailVerified: boolean("email_verified").default(false).notNull(),
	emailVerificationKey: text("email_verification_key"),
	emailVerificationKeyExpires: timestamp("email_verification_key_expires", { mode: 'string' }),
	isAdmin: boolean("is_admin").default(false).notNull(),
	isBanned: boolean("is_banned").default(false).notNull(),
	lastReset: timestamp("last_reset", { mode: 'string' }),
	profilePicture: text("profile_picture").default('skibiditoilet').notNull(),
	newEmail: varchar("new_email", { length: 255 }),
	newEmailVerificationKey: text("new_email_verification_key"),
	newEmailVerificationKeyExpires: timestamp("new_email_verification_key_expires", { mode: 'string' }),
	isVerified: boolean("is_verified").default(false).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const chapters = pgTable("chapters", {
	id: text().primaryKey().notNull(),
	chapterName: text("chapter_name").notNull(),
	chapterLocation: text("chapter_location").notNull(),
	description: text().notNull(),
	chapterWebsite: text("chapter website"),
});
