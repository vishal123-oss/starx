import { relations } from 'drizzle-orm';

import { bookings } from './booking';
import { clubs } from './club';
import { events } from './event';
import { fests } from './fest';
import { institutes } from './institute';
import { reminders } from './reminder';
import { schedules } from './schedule';
import { teams } from './team';
import { tickets } from './ticket';
import { transactions } from './transaction';
import { users } from './user';

// User relations
export const userRelations = relations(users, ({ one, many }) => ({
    institute: one(institutes, {
        fields: [users.college],
        references: [institutes.id],
    }),
    transactions: many(transactions),
    bookings: many(bookings),
    schedules: many(schedules),
    teamMemberships: many(teams),
}));

// Fest relations
export const festRelations = relations(fests, ({ many }) => ({
    transactions: many(transactions),
}));

// Club relations
export const clubRelations = relations(clubs, ({ many }) => ({
    events: many(events),
    teams: many(teams),
}));

// Event relations
export const eventRelations = relations(events, ({ one, many }) => ({
    club: one(clubs, {
        fields: [events.clubId],
        references: [clubs.id],
    }),
    bookings: many(bookings),
    schedules: many(schedules),
}));

// Institute relations
export const instituteRelations = relations(institutes, ({ many }) => ({
    users: many(users),
}));

// Transaction relations
export const transactionRelations = relations(transactions, ({ one }) => ({
    user: one(users, {
        fields: [transactions.userID],
        references: [users.id],
    }),
    fest: one(fests, {
        fields: [transactions.festID],
        references: [fests.id],
    }),
}));

// Booking relations
export const bookingRelations = relations(
    bookings,
    ({ one, many }) => ({
        user: one(users, {
            fields: [bookings.userID],
            references: [users.id],
        }),
        event: one(events, {
            fields: [bookings.eventID],
            references: [events.id],
        }),
        schedules: many(schedules),
        tickets: many(tickets),
    })
);

// Ticket relations
export const ticketRelations = relations(tickets, ({ one }) => ({
    booking: one(bookings, {
        fields: [tickets.bookingID],
        references: [bookings.id],
    }),
    checkedInByUser: one(users, {
        fields: [tickets.checkedInBy],
        references: [users.id],
    }),
}));

// Team relations
export const teamRelations = relations(teams, ({ one }) => ({
    user: one(users, {
        fields: [teams.userID],
        references: [users.id],
    }),
    club: one(clubs, {
        fields: [teams.clubID],
        references: [clubs.id],
    }),
}));

// Schedule relations
export const scheduleRelations = relations(schedules, ({ one, many }) => ({
    user: one(users, {
        fields: [schedules.userId],
        references: [users.id],
    }),
    event: one(events, {
        fields: [schedules.eventId],
        references: [events.id],
    }),
    booking: one(bookings, {
        fields: [schedules.bookingId],
        references: [bookings.id],
    }),
    reminders: many(reminders),
}));

// Reminder relations
export const reminderRelations = relations(reminders, ({ one }) => ({
    user: one(users, {
        fields: [reminders.userId],
        references: [users.id],
    }),
    event: one(events, {
        fields: [reminders.eventId],
        references: [events.id],
    }),
    schedule: one(schedules, {
        fields: [reminders.scheduleId],
        references: [schedules.id],
    }),
}));
