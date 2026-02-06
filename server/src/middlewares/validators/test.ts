import { z } from 'zod';

// Validation schemas for demonstration
export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    age: z.number().min(18, "Must be at least 18 years old").optional(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email format").optional(),
});

export const getUserQuerySchema = z.object({
    page: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1))
        .optional(),
    limit: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(z.number().min(1).max(100))
        .optional(),
    search: z.string().optional(),
});

export const userParamsSchema = z.object({
    id: z.string().uuid("Invalid user ID format"),
});

// Payload validation schemas for all POST APIs (restored from validation step)
export const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(1, "Name is required"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

export const bookEventSchema = z.object({
    eventId: z.string().min(1, "Event ID is required"),
    paymentData: z.object({
        amount: z.number().positive("Amount must be positive"),
        method: z.string().optional(),
    }).optional(),
});

export const setReminderSchema = z.object({
    scheduleId: z.string().min(1, "Schedule ID is required"),
    minutesBefore: z.number().min(1, "Minutes before must be positive"),
});

export const checkConflictSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    startDate: z.string().datetime("Invalid start date"),
    endDate: z.string().datetime("Invalid end date"),
});

export const verifyTicketSchema = z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
});

export const checkInSchema = z.object({
    checkedInBy: z.string().optional(),
});
