import { authService } from './auth.service';

/**
 * @description User service to handle user operations
 */
class UserService {
    /**
     * @description Get current user profile
     */
    public async getProfile(token: string) {
        const user = await authService.getUserByToken(token);
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            // Add more fields as needed
        };
    }

    /**
     * @description Update user profile
     */
    public async updateProfile(token: string, data: { name?: string; email?: string }) {
        const user = await authService.getUserByToken(token);
        return {
            ...user,
            ...data,
        };
    }
}

export const userService = new UserService();
