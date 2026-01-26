import { Hono } from 'hono';

import { authController } from '@/controllers/auth';
import { asyncHandler } from '@/middlewares';

const authRouter = new Hono();

authRouter.post('/register', asyncHandler(authController.register));
authRouter.post('/login', asyncHandler(authController.login));
authRouter.get('/me', asyncHandler(authController.me));

export { authRouter };
