/**
 * @description Event service to handle event operations
 */
class EventService {
    // Mock events data
    private mockEvents = [
        {
            id: 'mock-event-1',
            name: 'Mock Event for Booking',
            description: 'A mock event for testing bookings.',
            type: 'Test',
            startDate: new Date(Date.now() + 86400000).toISOString(),
            endDate: new Date(Date.now() + 172800000).toISOString(),
            location: 'Mock Venue',
            city: 'Mock City',
            state: 'Mock State',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: null,
            rules: ['Mock rule 1', 'Mock rule 2'],
            contact: ['+91 1234567890'],
            registrationFee: 100,
            capacity: 10,
            registered: 1,
        },
        {
            id: '1',
            name: 'Tech Hackathon',
            description: 'A 24-hour coding competition where participants build innovative solutions. Prizes worth ₹50,000!',
            type: 'Competition',
            startDate: new Date(Date.now() + 86400000).toISOString(),
            endDate: new Date(Date.now() + 172800000).toISOString(),
            location: 'Main Auditorium',
            city: 'Rourkela',
            state: 'Odisha',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: { first: 25000, second: 15000, third: 10000 },
            rules: ['Team size: 2-4 members', 'Bring your own laptop', 'No internet during competition'],
            contact: ['+91 9876543210', '+91 9876543211'],
            registrationFee: 500,
            capacity: 100,
            registered: 45,
        },
        {
            id: '2',
            name: 'Music Concert',
            description: 'Live music performance by renowned artists. An evening of melodies and rhythms.',
            type: 'Entertainment',
            startDate: new Date(Date.now() + 259200000).toISOString(),
            endDate: new Date(Date.now() + 259200000 + 10800000).toISOString(),
            location: 'Open Air Theatre',
            city: 'Rourkela',
            state: 'Odisha',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: null,
            rules: ['Entry after 6 PM', 'No outside food allowed'],
            contact: ['+91 9876543220'],
            registrationFee: 200,
            capacity: 500,
            registered: 320,
        },
        {
            id: '3',
            name: 'Dance Competition',
            description: 'Showcase your dance skills in various categories. Solo, Duo, and Group performances welcome.',
            type: 'Competition',
            startDate: new Date(Date.now() + 345600000).toISOString(),
            endDate: new Date(Date.now() + 345600000 + 10800000).toISOString(),
            location: 'Cultural Hall',
            city: 'Rourkela',
            state: 'Odisha',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: { first: 15000, second: 10000, third: 5000 },
            rules: ['Time limit: 5 minutes', 'Music to be provided', 'Costume required'],
            contact: ['+91 9876543230'],
            registrationFee: 300,
            capacity: 50,
            registered: 28,
        },
        {
            id: '4',
            name: 'Startup Pitch Competition',
            description: 'Pitch your startup idea to investors. Win funding and mentorship opportunities.',
            type: 'Competition',
            startDate: new Date(Date.now() + 432000000).toISOString(),
            endDate: new Date(Date.now() + 432000000 + 10800000).toISOString(),
            location: 'Business Center',
            city: 'Bhubaneswar',
            state: 'Odisha',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: { first: 100000, second: 50000, third: 25000 },
            rules: ['10-minute pitch', 'PPT required', 'Q&A session'],
            contact: ['+91 9876543240'],
            registrationFee: 1000,
            capacity: 30,
            registered: 18,
        },
        {
            id: '5',
            name: 'Photography Exhibition',
            description: 'Display your photography skills. Theme: Nature and Wildlife.',
            type: 'Exhibition',
            startDate: new Date(Date.now() + 518400000).toISOString(),
            endDate: new Date(Date.now() + 518400000 + 172800000).toISOString(),
            location: 'Art Gallery',
            city: 'Rourkela',
            state: 'Odisha',
            status: 'ACTIVE',
            poster: 'https://via.placeholder.com/400x300',
            prizeMoney: { first: 10000, second: 5000 },
            rules: ['Max 5 photos per participant', 'Digital format required'],
            contact: ['+91 9876543250'],
            registrationFee: 150,
            capacity: 100,
            registered: 67,
        },
    ];

    /**
     * @description Get all events
     */
    public getEvents(page: number = 1, limit: number = 10, search?: string, trending?: boolean) {
        let events = [...this.mockEvents];

        // Apply search filter
        if (search) {
            events = events.filter(
                (event) =>
                    event.name.toLowerCase().includes(search.toLowerCase()) ||
                    event.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Sort by trending (most recent first)
        if (trending) {
            events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        }

        // Apply pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedEvents = events.slice(start, end);

        return {
            events: paginatedEvents,
            pagination: {
                page,
                limit,
                total: events.length,
                totalPages: Math.ceil(events.length / limit),
            },
        };
    }

    /**
     * @description Get trending events
     */
    public getTrendingEvents(limit: number = 5) {
        const events = [...this.mockEvents];
        events.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        return events.slice(0, limit);
    }

    /**
     * @description Get event by ID
     */
    public getEventById(id: string) {
        const event = this.mockEvents.find((e) => e.id === id);
        if (!event) {
            throw new Error('Event not found');
        }
        return event;
    }
}

export const eventService = new EventService();
