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
            // Mock data for development
            return [
                {
                    id: 'mock-booking-1',
                    eventID: 'mock-event-1',
                    userID: userId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];
        }

        const userBookings = await db.select().from(bookings).where(eq(bookings.userID, userId));
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
