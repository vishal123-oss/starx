import type { AuthVariables } from '@/types';
import { Context, Next } from 'hono';

import { authService } from '@/services/auth.service';
import { createError } from './asyncHandler';

export const requireAuth = async (c: Context<unknown, string, AuthVariables>, next: Next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError.unauthorized('Unauthorized');
    }

    const token = authHeader.substring(7);
    try {
        const user = await authService.getUserByToken(token);
        c.set('user', user);
        await next();
    } catch (error: any) {
        throw createError.unauthorized(error.message || 'Invalid token');
    }
};
