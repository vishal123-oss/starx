import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { bookingController } from '@/controllers/booking';
import {
  asyncHandler,
  requireAuth,
  validateRequest,
} from '@/middlewares';
import { bookEventSchema } from '@/middlewares/validators';

const bookingRouter = new Hono<{ Variables: AuthVariables }>();

bookingRouter.post('/', validateRequest(bookEventSchema, 'body'), requireAuth, asyncHandler(bookingController.bookEvent));
bookingRouter.get('/my-bookings', requireAuth, asyncHandler(bookingController.getMyBookings));
bookingRouter.delete('/:bookingId', requireAuth, asyncHandler(bookingController.cancelBooking));

export { bookingRouter };
