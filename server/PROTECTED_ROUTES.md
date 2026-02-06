# Protected Routes Documentation

## Overview
This documents routes protected by `requireAuth` middleware (requires valid Bearer token) vs public ones. Changes ensure no impact on existing features (public routes remain open, protected require auth).

## Protected Routes (Require Authentication)
- `GET /api/auth/me` - Get current user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/bookings` - Book event
- `GET /api/bookings/my-bookings` - Get my bookings
- `DELETE /api/bookings/:bookingId` - Cancel booking
- `POST /api/schedules/set-reminder` - Set reminder
- `POST /api/schedules/check-conflict` - Check conflicts
- `GET /api/schedules/:id/ics` - Get schedule ICS
- `GET /api/tickets/:id` - Get ticket
- `POST /api/tickets/verify` - Verify ticket
- `POST /api/tickets/:id/check-in` - Check-in ticket
- `POST /api/verify-ticket` - Direct verify ticket

## Public Routes (No Auth Required)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/events` - List events
- `GET /api/events/trending` - Trending events
- `GET /api/events/:id` - Get event by ID
- `GET /health` - Health check
- All `/test/*` endpoints (demo/validation)
- `GET /` - Root info

## Testing Notes
See `tests/example.test.ts` for verification that changes don't break features.
Use Bearer token for protected tests.
