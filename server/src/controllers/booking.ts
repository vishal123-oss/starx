import { Context } from 'hono';

import { sendCreated, sendSuccess } from '@/middlewares';
import { bookingService } from '@/services/booking.service';
import { authService } from '@/services/auth.service';

export const bookingController = {
    bookEvent: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        const body = await c.req.json();
        const { eventId, paymentData } = body;

        try {
            const user = await authService.getUserByToken(token);
            const result = await bookingService.bookEvent(user.id, eventId, paymentData);
            return sendCreated(c, result, 'Event booked successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 400);
        }
    },

    getMyBookings: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        try {
            const user = await authService.getUserByToken(token);
            const bookings = await bookingService.getUserBookings(user.id);
            return sendSuccess(c, { bookings }, 'Bookings retrieved successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 401);
        }
    },

    cancelBooking: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        const { bookingId } = c.req.param();

        try {
            const user = await authService.getUserByToken(token);
            const result = await bookingService.cancelBooking(user.id, bookingId);
            return sendSuccess(c, result, 'Booking cancelled successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 400);
        }
    },
};
