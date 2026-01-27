import { Context } from 'hono';

import { sendSuccess, sendError } from '@/middlewares';
import { ticketService } from '@/services/ticket.service';

/**
 * @description Ticket controller
 */
class TicketController {
    /**
     * @description Get ticket by ID
     */
    public getTicket = async (c: Context) => {
        const ticketId = c.req.param('id');

        try {
            const ticket = await ticketService.getTicketById(ticketId);
            if (!ticket) {
                return sendError(c, 'Ticket not found', 404);
            }
            return sendSuccess(c, { ticket }, 'Ticket retrieved successfully');
        } catch (error: any) {
            return sendError(c, error.message, 400);
        }
    };

    /**
     * @description Verify a ticket (for scanning)
     */
    public verifyTicket = async (c: Context) => {
        const body = await c.req.json();
        const { ticketId } = body;

        if (!ticketId) {
            return sendError(c, 'Ticket ID is required', 400);
        }

        try {
            const result = await ticketService.verifyTicket(ticketId);
            return sendSuccess(c, result, result.valid ? 'Ticket is valid' : 'Ticket verification failed');
        } catch (error: any) {
            return sendError(c, error.message, 400);
        }
    };

    /**
     * @description Check in a ticket
     */
    public checkIn = async (c: Context) => {
        const ticketId = c.req.param('id');
        const body = await c.req.json();
        const { checkedInBy } = body;

        try {
            // First verify the ticket
            const verification = await ticketService.verifyTicket(ticketId);
            if (!verification.valid) {
                return sendError(c, verification.message || 'Invalid ticket', 400);
            }

            // Check in the ticket
            const ticket = await ticketService.checkInTicket(ticketId, checkedInBy || 'system');
            return sendSuccess(c, { ticket }, 'Ticket checked in successfully');
        } catch (error: any) {
            return sendError(c, error.message, 400);
        }
    };
}

export const ticketController = new TicketController();
