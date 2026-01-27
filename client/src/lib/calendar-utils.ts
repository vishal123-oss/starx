export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    location?: string;
    bookingId?: string;
    eventId?: string;
    status?: 'past' | 'upcoming' | 'today';
  };
}

export interface CalendarTheme {
  name: string;
  pastEvents: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
  upcomingEvents: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
  todayEvents: {
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
}

export interface BookingWithEvent {
  id: string;
  eventID: string;
  userID: string;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    startDate: string;
    endDate?: string;
    location?: string;
  };
}

/**
 * Maps user's bookings to FullCalendar event format
 */
export function mapBookingsToCalendarEvents(bookings: BookingWithEvent[]): CalendarEvent[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return bookings.map((booking) => {
    const startDate = new Date(booking.event.startDate);
    const eventDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    let status: 'past' | 'upcoming' | 'today';

    if (eventDay.getTime() === today.getTime()) {
      status = 'today';
    } else if (startDate >= now) {
      status = 'upcoming';
    } else {
      status = 'past';
    }

    return {
      id: booking.event.id,
      title: booking.event.name,
      start: startDate,
      end: booking.event.endDate ? new Date(booking.event.endDate) : undefined,
      extendedProps: {
        location: booking.event.location,
        bookingId: booking.id,
        eventId: booking.event.id,
        status,
      },
    };
  });
}

/**
 * Categorizes events into upcoming and past
 */
export function categorizeEvents(events: CalendarEvent[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const upcoming: CalendarEvent[] = [];
  const past: CalendarEvent[] = [];
  const todayEvents: CalendarEvent[] = [];

  events.forEach((event) => {
    const startDate = new Date(event.start);
    const eventDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

    if (eventDay.getTime() === today.getTime()) {
      todayEvents.push(event);
    } else if (startDate >= now) {
      upcoming.push(event);
    } else {
      past.push(event);
    }
  });

  return { upcoming, past, today: todayEvents };
}

// Default calendar themes - Calendly-inspired, clean and professional
export const DEFAULT_THEMES: Record<string, CalendarTheme> = {
  default: {
    name: 'Default',
    pastEvents: {
      backgroundColor: '#E5E7EB',
      borderColor: '#D1D5DB',
      textColor: '#374151',
    },
    upcomingEvents: {
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      textColor: '#FFFFFF',
    },
    todayEvents: {
      backgroundColor: '#059669',
      borderColor: '#047857',
      textColor: '#FFFFFF',
    },
  },
  professional: {
    name: 'Professional',
    pastEvents: {
      backgroundColor: '#F3F4F6',
      borderColor: '#E5E7EB',
      textColor: '#6B7280',
    },
    upcomingEvents: {
      backgroundColor: '#1F2937',
      borderColor: '#111827',
      textColor: '#FFFFFF',
    },
    todayEvents: {
      backgroundColor: '#7C3AED',
      borderColor: '#6D28D9',
      textColor: '#FFFFFF',
    },
  },
  minimal: {
    name: 'Minimal',
    pastEvents: {
      backgroundColor: '#F9FAFB',
      borderColor: '#F3F4F6',
      textColor: '#9CA3AF',
    },
    upcomingEvents: {
      backgroundColor: '#6B7280',
      borderColor: '#4B5563',
      textColor: '#FFFFFF',
    },
    todayEvents: {
      backgroundColor: '#374151',
      borderColor: '#1F2937',
      textColor: '#FFFFFF',
    },
  },
  warm: {
    name: 'Warm',
    pastEvents: {
      backgroundColor: '#FEF3C7',
      borderColor: '#FDE68A',
      textColor: '#92400E',
    },
    upcomingEvents: {
      backgroundColor: '#F59E0B',
      borderColor: '#D97706',
      textColor: '#FFFFFF',
    },
    todayEvents: {
      backgroundColor: '#DC2626',
      borderColor: '#B91C1C',
      textColor: '#FFFFFF',
    },
  },
  cool: {
    name: 'Cool',
    pastEvents: {
      backgroundColor: '#EEF2FF',
      borderColor: '#E0E7FF',
      textColor: '#3730A3',
    },
    upcomingEvents: {
      backgroundColor: '#3B82F6',
      borderColor: '#2563EB',
      textColor: '#FFFFFF',
    },
    todayEvents: {
      backgroundColor: '#06B6D4',
      borderColor: '#0891B2',
      textColor: '#FFFFFF',
    },
  },
};

/**
 * Applies theme colors to events based on their status
 */
export function applyThemeToEvents(events: CalendarEvent[], theme: CalendarTheme): CalendarEvent[] {
  return events.map((event) => {
    const status = event.extendedProps?.status;
    let colors;

    switch (status) {
      case 'past':
        colors = theme.pastEvents;
        break;
      case 'today':
        colors = theme.todayEvents;
        break;
      case 'upcoming':
      default:
        colors = theme.upcomingEvents;
        break;
    }

    return {
      ...event,
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
      textColor: colors.textColor,
    };
  });
}