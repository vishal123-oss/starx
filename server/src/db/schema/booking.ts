import {
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    eventID: text("event_id").notNull(),
    userID: text("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
