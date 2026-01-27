import { eq } from 'drizzle-orm';

import { db } from '../db/schema';
import { bookings } from '../db/schema/booking';
import { events } from '../db/schema/event';
import { ticketService } from './ticket.service';
import { scheduleService } from './schedule.service';

/**
 * @description Booking service to handle event bookings
 */
class BookingService {
    /**
     * @description Book an event for a user
     */
    public async bookEvent(userId: string, eventId: string, paymentData: any) {
        if (!db) {
            // Mock data for development
            const bookingId = crypto.randomUUID();
            const ticketId = crypto.randomUUID();
            const scheduleId = crypto.randomUUID();

            return {
                booking: {
                    id: bookingId,
                    eventID: eventId,
                    userID: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                ticket: {
                    id: ticketId,
                    status: 'ISSUED',
                    issuedAt: new Date(),
                },
                schedule: {
                    id: scheduleId,
                    userId,
                    eventId,
                    bookingId,
                    scheduledDate: new Date(),
                    reminderSent: false,
                },
            };
        }

        const newBooking = await db.insert(bookings).values({
            id: crypto.randomUUID(),
            eventID: eventId,
            userID: userId,
        }).returning();

        const booking = newBooking[0];

        // Generate ticket for the booking
        const ticket = await ticketService.createTicket(booking.id, eventId, userId);

        // Create schedule entry for the booked event
        let schedule = null;
        try {
            // Fetch event details for scheduling
            const eventData = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
            if (eventData.length > 0) {
                const event = eventData[0];
                // For now, schedule at event start date
                // TODO: Handle recurring events
                schedule = await scheduleService.createSchedule(userId, eventId, booking.id, event.startDate);
            }
        } catch (error) {
            console.error("Failed to create schedule:", error);
            // Don't fail booking if schedule creation fails
        }

        return {
            booking,
            ticket,
            schedule,
        };
    }

    /**
     * @description Get user's bookings
     */
    public async getUserBookings(userId: string) {
        if (!db) {
            // Mock data for development with various dates
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            const nextWeek = new Date(now);
            nextWeek.setDate(now.getDate() + 7);
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);

            return [
                {
                    id: 'mock-booking-1',
                    eventID: 'mock-event-1',
                    userID: userId,
                    createdAt: now,
                    updatedAt: now,
                    event: {
                        id: 'mock-event-1',
                        name: 'Tech Conference 2024',
                        startDate: tomorrow,
                        endDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
                        location: 'Convention Center, City Hall',
                    },
                },
                {
                    id: 'mock-booking-2',
                    eventID: 'mock-event-2',
                    userID: userId,
                    createdAt: now,
                    updatedAt: now,
                    event: {
                        id: 'mock-event-2',
                        name: 'Music Festival',
                        startDate: nextWeek,
                        endDate: new Date(nextWeek.getTime() + 8 * 60 * 60 * 1000), // 8 hours later
                        location: 'Central Park Amphitheater',
                    },
                },
                {
                    id: 'mock-booking-3',
                    eventID: 'mock-event-3',
                    userID: userId,
                    createdAt: yesterday,
                    updatedAt: yesterday,
                    event: {
                        id: 'mock-event-3',
                        name: 'Past Workshop: AI Basics',
                        startDate: yesterday,
                        endDate: new Date(yesterday.getTime() + 3 * 60 * 60 * 1000), // 3 hours later
                        location: 'Online',
                    },
                },
                {
                    id: 'mock-booking-4',
                    eventID: 'mock-event-4',
                    userID: userId,
                    createdAt: now,
                    updatedAt: now,
                    event: {
                        id: 'mock-event-4',
                        name: 'Startup Pitch Event',
                        startDate: nextMonth,
                        endDate: new Date(nextMonth.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
                        location: 'Innovation Hub',
                    },
                },
            ];
        }

        const userBookings = await db.select({
            id: bookings.id,
            eventID: bookings.eventID,
            userID: bookings.userID,
            createdAt: bookings.createdAt,
            updatedAt: bookings.updatedAt,
            event: {
                id: events.id,
                name: events.name,
                startDate: events.startDate,
                endDate: events.endDate,
                location: events.location,
            },
        }).from(bookings).leftJoin(events, eq(bookings.eventID, events.id)).where(eq(bookings.userID, userId));
        return userBookings;
    }

    /**
     * @description Cancel a booking
     */
    public async cancelBooking(userId: string, bookingId: string) {
        if (!db) {
            // Mock cancel
            return { id: bookingId };
        }

        const result = await db.delete(bookings).where(eq(bookings.id, bookingId)).returning();
        return result[0] || null;
    }
}

export const bookingService = new BookingService();
