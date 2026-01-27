import { Hono } from 'hono';

import { userController } from '@/controllers/user';
import { asyncHandler } from '@/middlewares';

const userRouter = new Hono();

userRouter.get('/profile', asyncHandler(userController.getProfile));
userRouter.put('/profile', asyncHandler(userController.updateProfile));

export { userRouter };
