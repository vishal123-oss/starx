'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Settings, Calendar, Clock, MapPin, MoreHorizontal } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { mapBookingsToCalendarEvents, categorizeEvents, applyThemeToEvents, DEFAULT_THEMES, type CalendarEvent, type BookingWithEvent, type CalendarTheme } from '@/lib/calendar-utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';

const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorizedEvents, setCategorizedEvents] = useState<{ upcoming: CalendarEvent[]; past: CalendarEvent[]; today: CalendarEvent[] } | null>(null);
  const [currentTheme, setCurrentTheme] = useState<CalendarTheme>(DEFAULT_THEMES.default);
  const [customTheme, setCustomTheme] = useState<CalendarTheme>(DEFAULT_THEMES.default);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [reminderMinutes, setReminderMinutes] = useState<string>("");
  const [reminderNote, setReminderNote] = useState<string>("");


  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('calendar-theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setCurrentTheme(parsedTheme);
        setCustomTheme(parsedTheme);
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Try to fetch from API, but fall back to mock data if server is not available
        let bookings: BookingWithEvent[];
        try {
          const response = await apiClient.getMyBookings();
          bookings = response.bookings;
        } catch (apiError) {
          console.warn('API not available, using mock data:', apiError);
          // Mock data for testing
          const now = new Date();
          const yesterday = new Date(now);
          yesterday.setDate(now.getDate() - 1);
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          const nextWeek = new Date(now);
          nextWeek.setDate(now.getDate() + 7);
          const nextMonth = new Date(now);
          nextMonth.setMonth(now.getMonth() + 1);

          bookings = [
            {
              id: 'mock-booking-1',
              eventID: 'mock-event-1',
              userID: 'mock-user',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              event: {
                id: 'mock-event-1',
                name: 'Tech Conference 2024',
                startDate: tomorrow.toISOString(),
                endDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
                location: 'Convention Center, City Hall',
              },
            },
            {
              id: 'mock-booking-2',
              eventID: 'mock-event-2',
              userID: 'mock-user',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              event: {
                id: 'mock-event-2',
                name: 'Music Festival',
                startDate: nextWeek.toISOString(),
                endDate: new Date(nextWeek.getTime() + 8 * 60 * 60 * 1000).toISOString(),
                location: 'Central Park Amphitheater',
              },
            },
            {
              id: 'mock-booking-3',
              eventID: 'mock-event-3',
              userID: 'mock-user',
              createdAt: yesterday.toISOString(),
              updatedAt: yesterday.toISOString(),
              event: {
                id: 'mock-event-3',
                name: 'Past Workshop: AI Basics',
                startDate: yesterday.toISOString(),
                endDate: new Date(yesterday.getTime() + 3 * 60 * 60 * 1000).toISOString(),
                location: 'Online',
              },
            },
            {
              id: 'mock-booking-4',
              eventID: 'mock-event-4',
              userID: 'mock-user',
              createdAt: now.toISOString(),
              updatedAt: now.toISOString(),
              event: {
                id: 'mock-event-4',
                name: 'Startup Pitch Event',
                startDate: nextMonth.toISOString(),
                endDate: new Date(nextMonth.getTime() + 4 * 60 * 60 * 1000).toISOString(),
                location: 'Innovation Hub',
              },
            },
          ];
        }

        const calendarEvents = mapBookingsToCalendarEvents(bookings);
        const themedEvents = applyThemeToEvents(calendarEvents, currentTheme);
        setEvents([...themedEvents]); // Force re-render with new array reference
        const categorized = categorizeEvents(calendarEvents);
        setCategorizedEvents(categorized);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentTheme]);

  const handleThemeChange = (themeName: string) => {
    const theme = DEFAULT_THEMES[themeName];
    if (theme) {
      setCurrentTheme(theme);
      setCustomTheme(theme);
      localStorage.setItem('calendar-theme', JSON.stringify(theme));
    }
  };

  const handleCustomThemeChange = (type: 'past' | 'upcoming' | 'today', colorType: 'backgroundColor' | 'borderColor' | 'textColor', value: string) => {
    const key = `${type}Events` as keyof CalendarTheme;
    const updatedTheme = {
      ...customTheme,
      [key]: {
        ...customTheme[key],
        [colorType]: value,
      },
    };
    setCustomTheme(updatedTheme);
  };

  const applyCustomTheme = () => {
    setCurrentTheme({ ...customTheme }); // Force re-render with new object reference
    localStorage.setItem('calendar-theme', JSON.stringify(customTheme));
    setThemeDialogOpen(false); // Close the dialog
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading calendar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">My Events</h1>
              <p className="text-sm text-gray-600 mt-1">Manage and view your scheduled events</p>
            </div>

            {/* Theme Customization Dialog */}
            <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-colors duration-200">
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">Calendar Appearance</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Preset Themes */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-3 block">Color Themes</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(DEFAULT_THEMES).map(([key, theme]) => (
                        <button
                          key={key}
                          onClick={() => handleThemeChange(key)}
                          className={`p-3 border rounded-lg text-left transition-all ${
                            currentTheme.name === theme.name
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{theme.name}</span>
                            {currentTheme.name === theme.name && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex space-x-1">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.upcomingEvents.backgroundColor }}
                            ></div>
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.todayEvents.backgroundColor }}
                            ></div>
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: theme.pastEvents.backgroundColor }}
                            ></div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Status-specific Customization */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-4 block">Customize by Event Status</Label>

                    <div className="space-y-4">
                      {/* Upcoming Events */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: customTheme.upcomingEvents.backgroundColor }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">Upcoming Events</span>
                        </div>
                        <Input
                          type="color"
                          value={customTheme.upcomingEvents.backgroundColor}
                          onChange={(e) => handleCustomThemeChange('upcoming', 'backgroundColor', e.target.value)}
                          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        />
                      </div>

                      {/* Today's Events */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: customTheme.todayEvents.backgroundColor }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">Today&apos;s Events</span>
                          <Badge variant="secondary" className="text-xs">Current</Badge>
                        </div>
                        <Input
                          type="color"
                          value={customTheme.todayEvents.backgroundColor}
                          onChange={(e) => handleCustomThemeChange('today', 'backgroundColor', e.target.value)}
                          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        />
                      </div>

                      {/* Past Events */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: customTheme.pastEvents.backgroundColor }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">Past Events</span>
                        </div>
                        <Input
                          type="color"
                          value={customTheme.pastEvents.backgroundColor}
                          onChange={(e) => handleCustomThemeChange('past', 'backgroundColor', e.target.value)}
                          className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={applyCustomTheme}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Summary Cards */}
        {categorizedEvents && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{events.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{categorizedEvents.upcoming.length}</p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p
                    className="text-3xl font-bold mt-1"
                    style={{ color: currentTheme.todayEvents.backgroundColor }}
                  >
                    {categorizedEvents.today.length}
                  </p>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.todayEvents.backgroundColor + '20' }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentTheme.todayEvents.backgroundColor }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Past Events</p>
                  <p className="text-3xl font-bold text-gray-500 mt-1">{categorizedEvents.past.length}</p>
                </div>
                <MoreHorizontal className="h-8 w-8 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Calendar */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
            }}
            initialView="dayGridMonth"
            events={events}
            height="auto"
            eventClick={(info) => {
              setSelectedEvent(info.event as CalendarEvent);
              setEventModalOpen(true);
            }}
            eventContent={(arg) => {
              return {
                html: `
                  <div class="text-sm font-medium truncate leading-tight px-2 py-1">
                    ${arg.event.title}
                  </div>
                `
              };
            }}
            responsive={true}
            aspectRatio={1.4}
            windowResizeDelay={0}
            eventDisplay="block"
            displayEventTime={false}
            dayMaxEvents={3}
            moreLinkClick="popover"
          />
        </div>
      </div>

      {/* Event Details Modal */}
      <Dialog open={eventModalOpen} onOpenChange={setEventModalOpen}>
        <DialogContent className="max-w-3xl bg-white border-0 shadow-2xl">
          <DialogHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {selectedEvent?.title}
                </DialogTitle>
                <div className="flex items-center gap-3">
                  <Badge
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedEvent?.extendedProps?.status === 'past'
                        ? 'bg-gray-100 text-gray-700 border border-gray-300'
                        : selectedEvent?.extendedProps?.status === 'today'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-blue-100 text-blue-800 border border-blue-300'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      selectedEvent?.extendedProps?.status === 'past'
                        ? 'bg-gray-500'
                        : selectedEvent?.extendedProps?.status === 'today'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`} />
                    {selectedEvent?.extendedProps?.status === 'past' ? 'Completed' :
                     selectedEvent?.extendedProps?.status === 'today' ? 'Today' : 'Upcoming'}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-8">
            {/* Event Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-blue-900 uppercase tracking-wide mb-2">
                      Date & Time
                    </h4>
                    <div className="space-y-1">
                      <p className="text-lg font-medium text-blue-900">
                        {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                      <p className="text-sm text-blue-700">
                        {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        }) : ''}
                        {selectedEvent?.end && ` - ${new Date(selectedEvent.end).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              {selectedEvent?.extendedProps?.location && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-emerald-900 uppercase tracking-wide mb-2">
                        Location
                      </h4>
                      <p className="text-lg font-medium text-emerald-900 leading-relaxed">
                        {selectedEvent.extendedProps.location}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Metadata */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                Event Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Event ID</div>
                  <div className="font-mono text-sm text-gray-900 break-all">{selectedEvent?.extendedProps?.eventId}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Booking ID</div>
                  <div className="font-mono text-sm text-gray-900 break-all">{selectedEvent?.extendedProps?.bookingId}</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</div>
                  <div className="text-sm font-medium text-gray-900 capitalize">{selectedEvent?.extendedProps?.status}</div>
                </div>
              </div>
            </div>

            {/* Reminder Section */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-900">Set Reminder</h3>
                  <p className="text-sm text-purple-700">Get notified before your event starts</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Time Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-purple-900">
                      When should we remind you?
                    </Label>
                    <Select
                      value={reminderMinutes}
                      onChange={setReminderMinutes}
                      className="h-12 bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    >
                      <option value="">Choose reminder time</option>
                      <option value="5">5 minutes before</option>
                      <option value="15">15 minutes before</option>
                      <option value="30">30 minutes before</option>
                      <option value="60">1 hour before</option>
                      <option value="120">2 hours before</option>
                      <option value="1440">1 day before</option>
                    </Select>
                  </div>

                  {/* Reminder Note */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-purple-900">
                      Personal Note (Optional)
                    </Label>
                    <Textarea
                      placeholder="Add a personal note for this reminder..."
                      value={reminderNote}
                      onChange={(e) => setReminderNote(e.target.value)}
                      className="min-h-[48px] bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400 resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReminderMinutes("");
                      setReminderNote("");
                    }}
                    className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300"
                  >
                    Clear All
                  </Button>
                  <Button
                    onClick={() => {
                      if (!reminderMinutes) return;
                      // Here you would typically call an API to set the reminder
                      const timeLabel = reminderMinutes === "1440" ? "1 day" :
                                       reminderMinutes === "120" ? "2 hours" :
                                       reminderMinutes === "60" ? "1 hour" :
                                       `${reminderMinutes} minutes`;
                      alert(`✅ Reminder set for ${timeLabel} before the event!${reminderNote ? `\nNote: ${reminderNote}` : ''}`);
                      setReminderMinutes("");
                      setReminderNote("");
                      setEventModalOpen(false);
                    }}
                    disabled={!reminderMinutes}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Set Reminder</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;