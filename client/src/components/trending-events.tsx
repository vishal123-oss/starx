"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import useSWR from "swr";

import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";

export function TrendingEventsSection() {
    const { data, isLoading } = useSWR(
        '/api/events/trending?limit=3',
        () => apiClient.getTrendingEvents(3),
        {
            revalidateOnFocus: false,
            dedupingInterval: 10000,
        }
    );

    const events = data?.events || [];

    return (
        <section className="bg-muted/30 py-24">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary font-medium">
                            <TrendingUp className="h-5 w-5" />
                            <span>Trending Now</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Popular Events Near You
                        </h2>
                        <p className="text-muted-foreground">
                            Don&apos;t miss out on these exciting upcoming events
                        </p>
                    </div>
                    <Button asChild variant="outline" className="w-fit">
                        <Link href="/events">
                            View All Events
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[16/9] rounded-xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No events available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
