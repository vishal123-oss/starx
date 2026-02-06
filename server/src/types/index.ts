export type { EnvConfig } from './env.types';

// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
    details?: any;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AuthUser {
    id: string;
    email: string;
    name?: string;
}

export type AuthVariables = {
    user: AuthUser;
};

declare module 'hono' {
    interface ContextVariableMap {
        user: AuthUser;
    }
}
