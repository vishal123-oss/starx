import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { userController } from '@/controllers/user';
import { asyncHandler, requireAuth } from '@/middlewares';

const userRouter = new Hono<{ Variables: AuthVariables }>();

userRouter.get('/profile', requireAuth, asyncHandler(userController.getProfile));
userRouter.put('/profile', requireAuth, asyncHandler(userController.updateProfile));

export { userRouter };
