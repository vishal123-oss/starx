import { Context } from 'hono';

import { sendSuccess } from '@/middlewares';
import { scheduleService } from '@/services/schedule.service';
import { reminderService } from '@/services/reminder.service';

/**
 * @description Schedule controller to handle schedule operations
 */
export const scheduleController = {
    /**
     * Set a reminder for a schedule
     */
    setReminder: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const body = await c.req.json();
        const { scheduleId, minutesBefore } = body;

        if (!scheduleId || typeof minutesBefore !== 'number') {
            return c.json({ error: 'scheduleId and minutesBefore (number) are required' }, 400);
        }

        try {
            // Get schedule details
            const schedule = await scheduleService.getScheduleById(scheduleId);
            if (!schedule) {
                return c.json({ error: 'Schedule not found' }, 404);
            }

            // Calculate reminder time
            const eventStart = new Date(schedule.scheduledDate);
            const reminderTime = new Date(eventStart.getTime() - minutesBefore * 60000);

            if (reminderTime <= new Date()) {
                return c.json({ error: 'Reminder time must be in the future' }, 400);
            }

            // Create reminder
            const reminder = await reminderService.createReminder(
                schedule.userId,
                schedule.eventId,
                scheduleId,
                reminderTime,
                'email'
            );

            return sendSuccess(c, { reminder }, 'Reminder set successfully');
        } catch (error: any) {
            return c.json({ error: error.message }, 500);
        }
    },

    /**
     * Check for scheduling conflicts
     */
    checkConflicts: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const body = await c.req.json();
        const { userId, startDate, endDate } = body;

        if (!userId || !startDate || !endDate) {
            return c.json({ error: 'userId, startDate, and endDate are required' }, 400);
        }

        const proposedStart = new Date(startDate);
        const proposedEnd = new Date(endDate);

        if (isNaN(proposedStart.getTime()) || isNaN(proposedEnd.getTime())) {
            return c.json({ error: 'Invalid date format' }, 400);
        }

        if (proposedStart >= proposedEnd) {
            return c.json({ error: 'startDate must be before endDate' }, 400);
        }

        const result = await scheduleService.checkConflicts(userId, proposedStart, proposedEnd);

        return sendSuccess(c, result, 'Conflict check completed');
    },

    /**
     * Generate and return iCalendar (.ics) content for a schedule
     */
    getScheduleICS: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const { id } = c.req.param();

        const icalContent = await scheduleService.generateICal(id);

        if (!icalContent) {
            return c.json({ error: 'Schedule not found' }, 404);
        }

        // Return as plain text with proper content type
        return c.text(icalContent, 200, {
            'Content-Type': 'text/calendar; charset=utf-8',
            'Content-Disposition': `attachment; filename="event-${id}.ics"`,
        });
    },
};