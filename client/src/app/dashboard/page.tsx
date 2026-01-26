"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Calendar, Ticket, TrendingUp, ArrowRight, Plus, BarChart3 } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";

export default function Dashboard() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();

    const { data: eventsData, isLoading: eventsLoading } = useSWR(
        isAuthenticated ? '/api/events/trending?limit=3' : null,
        () => apiClient.getTrendingEvents(3),
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000,
        }
    );

    const { data: bookingsData, isLoading: bookingsLoading } = useSWR(
        isAuthenticated ? '/api/bookings/my-bookings' : null,
        () => apiClient.getMyBookings(),
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000,
        }
    );

    const events = eventsData?.events || [];
    const bookingsCount = bookingsData?.bookings.length || 0;
    const loading = eventsLoading || bookingsLoading;

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [authLoading, isAuthenticated, router]);

    if (authLoading || !isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-16">
                <Skeleton className="h-10 w-64 mb-8" />
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-background border-b">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-muted-foreground mb-1">{getGreeting()}</p>
                            <h1 className="text-3xl font-bold">{user?.name}</h1>
                        </div>
                        <div className="flex gap-2">
                            <Button asChild variant="outline">
                                <Link href="/my-bookings">
                                    <Ticket className="mr-2 h-4 w-4" />
                                    My Bookings
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/admin/events/create">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Event
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">My Bookings</p>
                                    <p className="text-3xl font-bold">{bookingsCount}</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Ticket className="h-6 w-6 text-primary" />
                                </div>
                            </div>
                            <Link href="/my-bookings" className="text-sm text-primary mt-4 inline-flex items-center hover:underline">
                                View all bookings
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Events Available</p>
                                    <p className="text-3xl font-bold">{events.length}+</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Calendar className="h-6 w-6 text-green-500" />
                                </div>
                            </div>
                            <Link href="/events" className="text-sm text-green-600 dark:text-green-400 mt-4 inline-flex items-center hover:underline">
                                Browse events
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Trending Now</p>
                                    <p className="text-3xl font-bold">Hot</p>
                                </div>
                                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <TrendingUp className="h-6 w-6 text-orange-500" />
                                </div>
                            </div>
                            <Link href="/events" className="text-sm text-orange-600 dark:text-orange-400 mt-4 inline-flex items-center hover:underline">
                                See trending
                                <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommended Events */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Recommended for You</h2>
                            <p className="text-muted-foreground">
                                Based on your interests and location
                            </p>
                        </div>
                        <Button asChild variant="ghost">
                            <Link href="/events">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="aspect-[16/9] rounded-xl" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            ))}
                        </div>
                    ) : events.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Calendar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground">No events available</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
