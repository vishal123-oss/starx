import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { authController } from '@/controllers/auth';
import {
  asyncHandler,
  requireAuth,
  validateRequest,
} from '@/middlewares';
import {
  loginSchema,
  registerSchema,
} from '@/middlewares/validators';

const authRouter = new Hono<{ Variables: AuthVariables }>();

authRouter.post('/register', validateRequest(registerSchema, 'body'), asyncHandler(authController.register));
authRouter.post('/login', validateRequest(loginSchema, 'body'), asyncHandler(authController.login));
authRouter.get('/me', requireAuth, asyncHandler(authController.me));

export { authRouter };
