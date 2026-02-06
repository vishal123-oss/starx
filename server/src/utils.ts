import { TOKEN_EXPIRATION_MS } from './constants';

// Reusable utility functions
export const generateToken = (userId: string): string => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = { userId, exp: Date.now() + TOKEN_EXPIRATION_MS };
    
    // Mock JWT (in production, use proper JWT library)
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    return `${encodedHeader}.${encodedPayload}.mock-signature`;
};

export const getUserIdFromContext = (c: any): string => c.var.user?.id || '';

export const parseDateSafe = (dateStr: string): Date => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
};

export const isValidUUID = (id: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
};
