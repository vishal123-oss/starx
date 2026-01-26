// Environment configuration types

export interface EnvConfig {
    // Server Configuration
    PORT: number;
    // Database Configuration
    DATABASE_URL: string;
    RATE_LIMIT: number;
    RATE_LIMIT_WINDOW: number;
    // Ticket Encryption
    TICKET_ENCRYPTION_KEY: string;
}
