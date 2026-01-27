import { eq, lte } from "drizzle-orm";

import { db } from "../db/schema";
import { reminders } from "../db/schema/reminder";
import { users } from "../db/schema/user";
import { events } from "../db/schema/event";

/**
 * @description Reminder service to handle reminder operations
 */
class ReminderService {
    /**
     * Create a new reminder
     */
    async createReminder(
        userId: string,
        eventId: string,
        scheduleId: string,
        reminderTime: Date,
        type: string = "email"
    ) {
        if (!db) {
            console.log("Mock reminder created:", { userId, eventId, scheduleId, reminderTime, type });
            return { id: crypto.randomUUID() };
        }

        try {
            const newReminder = await db.insert(reminders).values({
                userId,
                eventId,
                scheduleId,
                reminderTime,
                type,
            }).returning();

            return newReminder[0];
        } catch (error) {
            console.error("Error creating reminder:", error);
            throw error;
        }
    }

    /**
     * Get due reminders (reminderTime <= now and not sent)
     */
    async getDueReminders() {
        if (!db) {
            return [];
        }

        try {
            const now = new Date();
            const dueReminders = await db
                .select({
                    reminder: reminders,
                    user: users,
                    event: events,
                })
                .from(reminders)
                .where(lte(reminders.reminderTime, now))
                .where(eq(reminders.sent, false))
                .innerJoin(users, eq(reminders.userId, users.id))
                .innerJoin(events, eq(reminders.eventId, events.id));

            return dueReminders;
        } catch (error) {
            console.error("Error fetching due reminders:", error);
            return [];
        }
    }

    /**
     * Mark reminder as sent
     */
    async markAsSent(reminderId: string) {
        if (!db) {
            console.log("Mock reminder marked as sent:", reminderId);
            return;
        }

        try {
            await db
                .update(reminders)
                .set({ sent: true, updatedAt: new Date() })
                .where(eq(reminders.id, reminderId));
        } catch (error) {
            console.error("Error marking reminder as sent:", error);
        }
    }
}

export const reminderService = new ReminderService();