import { Hono } from 'hono';

import { eventController } from '@/controllers/event';
import { asyncHandler } from '@/middlewares';

const eventRouter = new Hono();

eventRouter.get('/', asyncHandler(eventController.getEvents));
eventRouter.get('/trending', asyncHandler(eventController.getTrendingEvents));
eventRouter.get('/:id', asyncHandler(eventController.getEventById));

export { eventRouter };
