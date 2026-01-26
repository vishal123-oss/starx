import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import {
  errorHandler,
  notFoundHandler,
} from './middlewares';
import { routes } from './routes';
import { rateLimit } from './middlewares/rateLimit';

const app = new Hono();

// CORS middleware
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware
app.use("*", logger());

// Rate limiting middleware
app.use('*', rateLimit);

// Routes
app.route("/", routes);

// 404 handler for unmatched routes
app.notFound(notFoundHandler);

// Global error handler
app.onError(errorHandler);

export default app;
