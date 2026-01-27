import { eq } from "drizzle-orm";

import { db } from "../db/schema";
import { schedules } from "../db/schema/schedule";
import { events } from "../db/schema/event";
import { bookings } from "../db/schema/booking";

interface ConflictCheckResult {
    hasConflict: boolean;
    conflictingSchedules: Array<{
        id: string;
        eventName: string;
        scheduledDate: Date;
        endDate: Date;
    }>;
}

/**
 * @description Schedule service to handle schedule operations
 */
class ScheduleService {
    /**
     * Create a new schedule entry
     */
    async createSchedule(userId: string, eventId: string, bookingId: string, scheduledDate: Date) {
        if (!db) {
            // Mock creation
            console.log("Mock schedule created:", { userId, eventId, bookingId, scheduledDate });
            return { id: crypto.randomUUID() };
        }

        try {
            const newSchedule = await db.insert(schedules).values({
                id: crypto.randomUUID(),
                userId,
                eventId,
                bookingId,
                scheduledDate,
                reminderSent: false,
            }).returning();

            return newSchedule[0];
        } catch (error) {
            console.error("Error creating schedule:", error);
            throw error;
        }
    }

    /**
     * Get schedule by ID
     */
    async getScheduleById(scheduleId: string) {
        if (!db) {
            return null;
        }

        try {
            const result = await db
                .select()
                .from(schedules)
                .where(eq(schedules.id, scheduleId))
                .limit(1);

            return result[0] || null;
        } catch (error) {
            console.error("Error fetching schedule:", error);
            return null;
        }
    }

    /**
     * Check for scheduling conflicts for a user
     * @param userId - The user ID
     * @param proposedStart - Proposed event start date
     * @param proposedEnd - Proposed event end date
     * @returns Conflict check result
     */
    async checkConflicts(
        userId: string,
        proposedStart: Date,
        proposedEnd: Date
    ): Promise<ConflictCheckResult> {
        if (!db) {
            // Mock conflict check
            return { hasConflict: false, conflictingSchedules: [] };
        }

        try {
            // Fetch user's schedules with event details
            const userSchedules = await db
                .select({
                    schedule: schedules,
                    event: events,
                })
                .from(schedules)
                .where(eq(schedules.userId, userId))
                .innerJoin(events, eq(schedules.eventId, events.id));

            const conflicts: ConflictCheckResult['conflictingSchedules'] = [];

            for (const { schedule, event } of userSchedules) {
                // Calculate actual end time for this scheduled event
                const eventStart = schedule.scheduledDate;
                let eventEnd: Date;

                if (event.endDate) {
                    // Calculate duration from event template
                    const duration = event.endDate.getTime() - event.startDate.getTime();
                    eventEnd = new Date(eventStart.getTime() + duration);
                } else {
                    // Default 1 hour if no end date
                    eventEnd = new Date(eventStart.getTime() + 3600000);
                }

                // Check for overlap: existing.start < proposed.end AND existing.end > proposed.start
                if (eventStart < proposedEnd && eventEnd > proposedStart) {
                    conflicts.push({
                        id: schedule.id,
                        eventName: event.name,
                        scheduledDate: eventStart,
                        endDate: eventEnd,
                    });
                }
            }

            return {
                hasConflict: conflicts.length > 0,
                conflictingSchedules: conflicts,
            };
        } catch (error) {
            console.error("Error checking conflicts:", error);
            return { hasConflict: false, conflictingSchedules: [] };
        }
    }

    /**
     * Generate iCalendar (.ics) content for a schedule
     * @param scheduleId - The ID of the schedule
     * @returns iCalendar string or null if not found
     */
    async generateICal(scheduleId: string): Promise<string | null> {
        if (!db) {
            // Mock data for testing
            return this.generateMockICal();
        }

        try {
            // Fetch schedule with event details
            const result = await db
                .select({
                    schedule: schedules,
                    event: events,
                })
                .from(schedules)
                .where(eq(schedules.id, scheduleId))
                .innerJoin(events, eq(schedules.eventId, events.id))
                .limit(1);

            if (result.length === 0) {
                return null;
            }

            const { schedule, event } = result[0];

            return this.buildICalString(schedule, event);
        } catch (error) {
            console.error("Error generating iCal:", error);
            return null;
        }
    }

    /**
     * Build iCalendar string following RFC 5545
     */
    private buildICalString(schedule: any, event: any): string {
        const now = new Date();
        const created = this.formatDateTime(now);
        const lastModified = this.formatDateTime(now);
        const startTime = this.formatDateTime(schedule.scheduledDate);
        const endTime = event.endDate ? this.formatDateTime(event.endDate) : this.formatDateTime(new Date(schedule.scheduledDate.getTime() + 3600000)); // Default 1 hour

        const uid = `${schedule.id}@eventmanagement.com`;

        const ical = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//EventManagement//Calendar//EN",
            "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            `UID:${uid}`,
            `DTSTART:${startTime}`,
            `DTEND:${endTime}`,
            `DTSTAMP:${created}`,
            `CREATED:${created}`,
            `LAST-MODIFIED:${lastModified}`,
            `SUMMARY:${this.escapeText(event.name)}`,
            `DESCRIPTION:${this.escapeText(event.description)}`,
            event.location ? `LOCATION:${this.escapeText(event.location)}` : "",
            "STATUS:CONFIRMED",
            "END:VEVENT",
            "END:VCALENDAR",
        ].filter(line => line !== "").join("\r\n");

        return ical;
    }

    /**
     * Format date to iCalendar format (YYYYMMDDTHHMMSSZ)
     */
    private formatDateTime(date: Date): string {
        return date.toISOString().replace(/[:-]/g, "").replace(/\.\d{3}/, "") + "Z";
    }

    /**
     * Escape text for iCalendar (RFC 5545)
     */
    private escapeText(text: string): string {
        return text
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");
    }

    /**
     * Mock iCalendar for testing without DB
     */
    private generateMockICal(): string {
        const now = new Date();
        const startTime = new Date(now.getTime() + 86400000); // Tomorrow
        const endTime = new Date(startTime.getTime() + 3600000); // 1 hour later

        return [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//EventManagement//Calendar//EN",
            "CALSCALE:GREGORIAN",
            "BEGIN:VEVENT",
            "UID:mock-event@eventmanagement.com",
            `DTSTART:${this.formatDateTime(startTime)}`,
            `DTEND:${this.formatDateTime(endTime)}`,
            `DTSTAMP:${this.formatDateTime(now)}`,
            `CREATED:${this.formatDateTime(now)}`,
            `LAST-MODIFIED:${this.formatDateTime(now)}`,
            "SUMMARY:Mock Event",
            "DESCRIPTION:This is a mock event for testing calendar invites.",
            "LOCATION:Mock Venue",
            "STATUS:CONFIRMED",
            "END:VEVENT",
            "END:VCALENDAR",
        ].join("\r\n");
    }
}

export const scheduleService = new ScheduleService();