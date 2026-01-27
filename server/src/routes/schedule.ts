import { Hono } from 'hono';

import { scheduleController } from '@/controllers/schedule';
import { asyncHandler } from '@/middlewares';

const scheduleRouter = new Hono();

scheduleRouter.post('/set-reminder', asyncHandler(scheduleController.setReminder));
scheduleRouter.post('/check-conflict', asyncHandler(scheduleController.checkConflicts));
scheduleRouter.get('/:id/ics', asyncHandler(scheduleController.getScheduleICS));

export { scheduleRouter };