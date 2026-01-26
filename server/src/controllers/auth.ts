import { Context } from 'hono';

import { sendCreated, sendSuccess } from '@/middlewares';
import { authService } from '@/services/auth.service';

export const authController = {
    register: async (c: Context) => {
        try {
            const body = await c.req.json();
            const { email, password, name } = body;

            if (!email || !password || !name) {
                return c.json({ success: false, message: 'Missing required fields' }, 400);
            }

            try {
                const result = await authService.register(email, password, name);
                return sendSuccess(c, result, 'User registered successfully', 201);
            } catch (error: any) {
                return c.json({ success: false, message: error.message || 'Registration failed' }, 400);
            }
        } catch (error: any) {
            return c.json({ success: false, message: 'Invalid request body' }, 400);
        }
    },

    login: async (c: Context) => {
        const body = await c.req.json();
        const { email, password } = body;

        if (!email || !password) {
            return c.json({ success: false, message: 'Email and password are required' }, 400);
        }

        try {
            const result = await authService.login(email, password);
            return sendSuccess(c, result, 'Login successful');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 401);
        }
    },

    me: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        try {
            const user = await authService.getUserByToken(token);
            return sendSuccess(c, { user }, 'User retrieved successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 401);
        }
    },
};
