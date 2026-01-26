import { Context } from 'hono';

import { sendSuccess } from '@/middlewares';
import { eventService } from '@/services/event.service';

export const eventController = {
    getEvents: async (c: Context) => {
        const query = c.req.query();
        const page = query.page ? parseInt(query.page, 10) : 1;
        const limit = query.limit ? parseInt(query.limit, 10) : 10;
        const search = query.search || '';
        const trending = query.trending === 'true';

        const result = eventService.getEvents(page, limit, search, trending);
        return sendSuccess(c, result, 'Events retrieved successfully');
    },

    getTrendingEvents: async (c: Context) => {
        const query = c.req.query();
        const limit = query.limit ? parseInt(query.limit, 10) : 5;
        const events = eventService.getTrendingEvents(limit);
        return sendSuccess(c, { events }, 'Trending events retrieved successfully');
    },

    getEventById: async (c: Context) => {
        const { id } = c.req.param();
        
        try {
            const event = eventService.getEventById(id);
            return sendSuccess(c, { event }, 'Event retrieved successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 404);
        }
    },
};
