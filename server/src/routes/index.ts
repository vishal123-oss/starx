import { Hono } from 'hono';

import { sendSuccess } from '@/middlewares';
import { healthService } from '@/services/health.service';
import { ticketController } from '@/controllers';

import { authRouter } from './auth';
import { bookingRouter } from './booking';
import { eventRouter } from './event';
import { healthRouter } from './health';
import { scheduleRouter } from './schedule';
import { testRouter } from './test';
import { ticketRouter } from './ticket';
import { userRouter } from './user';

export const routes = new Hono();

routes.route("/health", healthRouter);
routes.route("/api/auth", authRouter);
routes.route("/api/users", userRouter);
routes.route("/api/events", eventRouter);
routes.route("/api/bookings", bookingRouter);
routes.route("/api/schedules", scheduleRouter);
routes.route("/api/tickets", ticketRouter);

// Direct route for verify-ticket
routes.post('/api/verify-ticket', ticketController.verifyTicket);

routes.get("/", (c) => {
    return sendSuccess(c, healthService.about());
});
