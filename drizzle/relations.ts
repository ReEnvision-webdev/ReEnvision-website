import { relations } from "drizzle-orm/relations";
import { users, events } from "./schema";

export const eventsRelations = relations(events, ({one}) => ({
	user: one(users, {
		fields: [events.createdBy],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	events: many(events),
}));