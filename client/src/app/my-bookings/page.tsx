"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Clock, ExternalLink, X, CheckCircle2 } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";

export default function MyBookingsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [cancelling, setCancelling] = useState<string | null>(null);

    const { data: bookingsData, isLoading: bookingsLoading, mutate } = useSWR(
        isAuthenticated ? '/api/bookings/my-bookings' : null,
        () => apiClient.getMyBookings(),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    const bookings = bookingsData?.bookings || [];

    // Load events for bookings
    const { data: eventsData } = useSWR(
        isAuthenticated && bookings.length > 0
            ? `/api/events?ids=${bookings.map(b => b.eventID).join(',')}`
            : null,
        async () => {
            const eventMap = new Map();
            await Promise.all(
                bookings.map(async (booking: any) => {
                    try {
                        const eventData = await apiClient.getEventById(booking.eventID);
                        eventMap.set(booking.eventID, eventData.event);
                    } catch (err) {
                        console.error("Failed to load event:", booking.eventID);
                    }
                })
            );
            return eventMap;
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000,
        }
    );

    const events = eventsData || new Map();
    const loading = bookingsLoading;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
            return;
        }
    }, [isAuthenticated, authLoading]);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        setCancelling(bookingId);
        try {
            await apiClient.cancelBooking(bookingId);
            mutate({
                ...bookingsData,
                bookings: bookings.filter((b) => b.id !== bookingId)
            }, false);
        } catch (error: any) {
            alert("Failed to cancel booking: " + (error.message || "Unknown error"));
        } finally {
            setCancelling(null);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Skeleton className="h-10 w-48 mb-8" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const success = searchParams.get("success");

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-background border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Ticket className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">My Bookings</h1>
                            <p className="text-muted-foreground">
                                Manage your event registrations
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {success && (
                    <Alert variant="success" className="mb-6">
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Booking Confirmed!</AlertTitle>
                        <AlertDescription>
                            Your event registration has been confirmed. Check your email for the e-ticket.
                        </AlertDescription>
                    </Alert>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 rounded-xl" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Ticket className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                            <p className="text-muted-foreground mb-6">
                                You haven&apos;t registered for any events yet. Explore events and make your first booking!
                            </p>
                            <Button asChild>
                                <Link href="/events">Browse Events</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => {
                            const event = events.get(booking.eventID);
                            const isEventLoading = !event;

                            return (
                                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Event Image */}
                                            <div className="md:w-48 h-32 md:h-auto bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                                                <Calendar className="h-12 w-12 text-primary/30" />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-6">
                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            {event ? (
                                                                <>
                                                                    <Badge variant={new Date(event.startDate) > new Date() ? "success" : "secondary"}>
                                                                        {new Date(event.startDate) > new Date() ? "Upcoming" : "Past"}
                                                                    </Badge>
                                                                    <Badge variant="outline">{event.type}</Badge>
                                                                </>
                                                            ) : (
                                                                <Skeleton className="h-5 w-20" />
                                                            )}
                                                        </div>

                                                        <h3 className="text-xl font-semibold">
                                                            {event ? event.name : <Skeleton className="h-6 w-48" />}
                                                        </h3>

                                                        <div className="space-y-2 text-sm text-muted-foreground">
                                                            {event ? (
                                                                <>
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="h-4 w-4" />
                                                                        <span>
                                                                            {new Date(event.startDate).toLocaleDateString("en-US", {
                                                                                weekday: "long",
                                                                                year: "numeric",
                                                                                month: "long",
                                                                                day: "numeric",
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Clock className="h-4 w-4" />
                                                                        <span>
                                                                            {new Date(event.startDate).toLocaleTimeString("en-US", {
                                                                                hour: "2-digit",
                                                                                minute: "2-digit",
                                                                            })}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <MapPin className="h-4 w-4" />
                                                                        <span>
                                                                            {event.location}, {event.city}
                                                                        </span>
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Skeleton className="h-4 w-64" />
                                                                    <Skeleton className="h-4 w-32" />
                                                                    <Skeleton className="h-4 w-48" />
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs text-muted-foreground">Amount Paid</p>
                                                            <p className="text-xl font-bold">
                                                                {event ? `₹${event.registrationFee}` : <Skeleton className="h-6 w-16" />}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Separator className="my-4" />

                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-muted-foreground">
                                                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {event ? (
                                                            <Button asChild variant="outline" size="sm">
                                                                <Link href={`/events/${event.id}`}>
                                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                                    View Event
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <Skeleton className="h-8 w-24" />
                                                        )}
                                                        {event && new Date(event.startDate) > new Date() && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleCancel(booking.id)}
                                                                disabled={cancelling === booking.id}
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <X className="mr-2 h-4 w-4" />
                                                                {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
