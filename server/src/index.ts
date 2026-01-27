import { serve } from '@hono/node-server';
import app from './app';
import {
  env,
  validateEnv,
} from './config/env';
import { reminderService } from './services/reminder.service';
import { sendReminderEmail } from './services/email.service';

// Validate environment variables on startup
validateEnv();

console.log(`Server running on port ${env.PORT}`);

serve({
  fetch: app.fetch,
  port: env.PORT,
  hostname: '0.0.0.0',
}, (info) => {
  console.log(`Server listening on http://localhost:${info.port}`);
});

// Start reminder worker
setInterval(async () => {
    try {
        const dueReminders = await reminderService.getDueReminders();
        for (const { reminder, user, event } of dueReminders) {
            try {
                await sendReminderEmail(user, event, reminder);
                await reminderService.markAsSent(reminder.id);
                console.log(`Reminder sent for event: ${event.name} to ${user.email}`);
            } catch (error) {
                console.error(`Failed to send reminder ${reminder.id}:`, error);
            }
        }
    } catch (error) {
        console.error('Error in reminder worker:', error);
    }
}, 60000); // Check every minute
