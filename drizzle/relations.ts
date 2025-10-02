import { relations } from "drizzle-orm/relations";
import { users, events, courses, customers } from "./schema";

export const eventsRelations = relations(events, ({one}) => ({
	user: one(users, {
		fields: [events.createdBy],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	events: many(events),
}));

export const customersRelations = relations(customers, ({one}) => ({
	course: one(courses, {
		fields: [customers.courseId],
		references: [courses.id]
	}),
}));

export const coursesRelations = relations(courses, ({many}) => ({
	customers: many(customers),
}));