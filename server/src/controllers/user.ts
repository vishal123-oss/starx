import { Context } from 'hono';

import { sendSuccess } from '@/middlewares';
import { userService } from '@/services/user.service';

export const userController = {
    getProfile: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        try {
            const profile = await userService.getProfile(token);
            return sendSuccess(c, { profile }, 'Profile retrieved successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 401);
        }
    },

    updateProfile: async (c: Context) => {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ success: false, message: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);
        const body = await c.req.json();
        
        try {
            const profile = await userService.updateProfile(token, body);
            return sendSuccess(c, { profile }, 'Profile updated successfully');
        } catch (error: any) {
            return c.json({ success: false, message: error.message }, 401);
        }
    },
};
