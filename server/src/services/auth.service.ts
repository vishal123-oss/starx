/**
 * @description Auth service to handle authentication operations
 */
class AuthService {
    // Mock user storage (in production, use database)
    private mockUsers: Map<string, { email: string; password: string; id: string; name: string }> = new Map();

    /**
     * @description Register a new user
     */
    public async register(email: string, password: string, name: string) {
        // Check if user exists
        if (this.mockUsers.has(email)) {
            throw new Error("User already exists");
        }

        const userId = crypto.randomUUID();
        this.mockUsers.set(email, {
            email,
            password, // In production, hash this
            id: userId,
            name,
        });

        return {
            user: {
                id: userId,
                email,
                name,
            },
            token: this.generateToken(userId), // Mock JWT token
        };
    }

    /**
     * @description Login user
     */
    public async login(email: string, password: string) {
        const user = this.mockUsers.get(email);
        
        if (!user || user.password !== password) {
            throw new Error("Invalid email or password");
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token: this.generateToken(user.id),
        };
    }

    /**
     * @description Get user by token
     */
    public async getUserByToken(token: string) {
        // In production, verify JWT token
        // For now, just extract user ID from token
        try {
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            const user = Array.from(this.mockUsers.values()).find(u => u.id === payload.userId);
            
            if (!user) {
                throw new Error("User not found");
            }

            return {
                id: user.id,
                email: user.email,
                name: user.name,
            };
        } catch {
            throw new Error("Invalid token");
        }
    }

    /**
     * @description Generate mock JWT token
     */
    private generateToken(userId: string): string {
        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = { userId, exp: Date.now() + 86400000 }; // 24 hours
        
        // Mock JWT (in production, use proper JWT library)
        const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
        const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
        
        return `${encodedHeader}.${encodedPayload}.mock-signature`;
    }
}

export const authService = new AuthService();
