export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized',
    BAD_REQUEST: 'Bad Request',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_JSON: 'Invalid JSON format',
    MISSING_FIELDS: 'Missing required fields',
    INVALID_CREDENTIALS: 'Email and password are required',
    REGISTRATION_FAILED: 'Registration failed',
    INVALID_TOKEN: 'Invalid token',
    SCHEDULE_NOT_FOUND: 'Schedule not found',
    TICKET_NOT_FOUND: 'Ticket not found',
    // Add more as needed from controllers/services
} as const;

export const TOKEN_EXPIRATION_MS = 86400000; // 24 hours

export const MOCK_POSTER_URL = 'https://via.placeholder.com/400x300';
export const DEFAULT_PAGE_LIMIT = 10;
export const DEFAULT_TRENDING_LIMIT = 5;
