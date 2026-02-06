import type { AuthVariables } from '@/types';
import { Hono } from 'hono';

import { healthController } from '@/controllers';
import { asyncHandler } from '@/middlewares';

const healthRouter = new Hono<{ Variables: AuthVariables }>();

healthRouter.get("/", asyncHandler(healthController.getHealth));

export { healthRouter };
