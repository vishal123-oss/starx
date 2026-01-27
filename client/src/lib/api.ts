// Use relative URL to proxy through Next.js server (see next.config.ts rewrites)
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}

class ApiClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers,
        });

        const data: ApiResponse<T> = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || data.error || 'An error occurred');
        }

        return data.data as T;
    }

    // Auth endpoints
    async register(email: string, password: string, name: string) {
        return this.request<{ user: any; token: string }>('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    async login(email: string, password: string) {
        return this.request<{ user: any; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    }

    async getMe() {
        return this.request<{ user: any }>('/api/auth/me');
    }

    // User endpoints
    async getProfile() {
        return this.request<{ profile: any }>('/api/users/profile');
    }

    async updateProfile(data: { name?: string; email?: string }) {
        return this.request<{ profile: any }>('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Event endpoints
    async getEvents(page = 1, limit = 10, search = '') {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(search && { search }),
        });
        return this.request<{ events: any[]; pagination: any }>(`/api/events?${params}`);
    }

    async getEventById(id: string) {
        return this.request<{ event: any }>(`/api/events/${id}`);
    }

    async getTrendingEvents(limit = 5) {
        return this.request<{ events: any[] }>(`/api/events/trending?limit=${limit}`);
    }

    // Booking endpoints
    async bookEvent(eventId: string, paymentData: any) {
        return this.request<{ booking: any, ticket: any }>('/api/bookings', {
            method: 'POST',
            body: JSON.stringify({ eventId, paymentData }),
        });
    }

    async getMyBookings() {
        return this.request<{ bookings: any[] }>('/api/bookings/my-bookings');
    }

    async cancelBooking(bookingId: string) {
        return this.request('/api/bookings/' + bookingId, {
            method: 'DELETE',
        });
    }

    // Schedule endpoints
    async setReminder(scheduleId: string, minutesBefore: number) {
        return this.request<{ reminder: any }>('/api/schedules/set-reminder', {
            method: 'POST',
            body: JSON.stringify({ scheduleId, minutesBefore }),
        });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
