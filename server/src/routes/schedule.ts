import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { scheduleController } from '@/controllers/schedule';
import {
  asyncHandler,
  requireAuth,
  validateRequest,
} from '@/middlewares';
import {
  checkConflictSchema,
  setReminderSchema,
} from '@/middlewares/validators';

const scheduleRouter = new Hono<{ Variables: AuthVariables }>();

scheduleRouter.post('/set-reminder', validateRequest(setReminderSchema, 'body'), requireAuth, asyncHandler(scheduleController.setReminder));
scheduleRouter.post('/check-conflict', validateRequest(checkConflictSchema, 'body'), requireAuth, asyncHandler(scheduleController.checkConflicts));
scheduleRouter.get('/:id/ics', requireAuth, asyncHandler(scheduleController.getScheduleICS));

export { scheduleRouter };