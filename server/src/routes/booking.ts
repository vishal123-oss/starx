import { Hono } from 'hono';

import { bookingController } from '@/controllers/booking';
import { asyncHandler } from '@/middlewares';

const bookingRouter = new Hono();

bookingRouter.post('/', asyncHandler(bookingController.bookEvent));
bookingRouter.get('/my-bookings', asyncHandler(bookingController.getMyBookings));
bookingRouter.delete('/:bookingId', asyncHandler(bookingController.cancelBooking));

export { bookingRouter };
