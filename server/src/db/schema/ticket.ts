import {
    pgTable,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

export const tickets = pgTable("tickets", {
    id: text("id").primaryKey(), // Encrypted QR data as ID
    bookingID: text("booking_id").notNull(),
    status: text("status").notNull().default('ISSUED'), // ISSUED, CHECKED_IN, CANCELLED, REFUNDED
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
    checkedInAt: timestamp("checked_in_at"),
    checkedInBy: text("checked_in_by"),
    qrData: text("qr_data").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
