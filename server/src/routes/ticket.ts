import { Hono } from 'hono';

import { ticketController } from '@/controllers';

const ticketRouter = new Hono();

// Get ticket by ID
ticketRouter.get('/:id', ticketController.getTicket);

// Verify ticket (for scanning)
ticketRouter.post('/verify', ticketController.verifyTicket);

// Check in a ticket
ticketRouter.post('/:id/check-in', ticketController.checkIn);

export { ticketRouter };
