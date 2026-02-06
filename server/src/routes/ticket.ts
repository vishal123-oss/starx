import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { ticketController } from '@/controllers';
import {
  asyncHandler,
  requireAuth,
  validateRequest,
} from '@/middlewares';
import {
  checkInSchema,
  verifyTicketSchema,
} from '@/middlewares/validators';

const ticketRouter = new Hono<{ Variables: AuthVariables }>();

// Get ticket by ID
ticketRouter.get('/:id', requireAuth, asyncHandler(ticketController.getTicket));

// Verify ticket (for scanning)
ticketRouter.post('/verify', validateRequest(verifyTicketSchema, 'body'), requireAuth, asyncHandler(ticketController.verifyTicket));

// Check in a ticket
ticketRouter.post('/:id/check-in', validateRequest(checkInSchema, 'body'), requireAuth, asyncHandler(ticketController.checkIn));

export { ticketRouter };
