"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import useSWR from "swr";

import { EventCard } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/lib/api";

const eventTypes = ["All", "Competition", "Entertainment", "Exhibition", "Workshop"];

export default function EventsPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    const { data, error, isLoading } = useSWR(
        `/api/events?page=${page}&limit=9&search=${search}`,
        async (url) => {
            const params = new URLSearchParams(url.split('?')[1]);
            const pageNum = parseInt(params.get('page') || '1');
            const searchTerm = params.get('search') || '';
            const data = await apiClient.getEvents(pageNum, 9, searchTerm);
            return data;
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 5000, // Cache for 5 seconds
        }
    );

    const filteredEvents = data?.events?.filter((e: any) =>
        selectedType === "All" || e.type === selectedType
    ) || [];

    const totalPages = data?.pagination.totalPages || 1;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-b from-primary/5 to-background border-b">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="max-w-3xl">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Discover Amazing Events
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8">
                            Browse through hundreds of events happening near you. 
                            From hackathons to concerts, find your next experience.
                        </p>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search events..."
                                    className="pl-10 h-12"
                                />
                            </div>
                            <Button type="submit" size="lg" className="h-12">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Filters & Events */}
            <div className="container mx-auto px-4 py-8">
                {/* Type Filters */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    {eventTypes.map((type) => (
                        <Badge
                            key={type}
                            variant={selectedType === type ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/90 transition-colors shrink-0"
                            onClick={() => {
                                setSelectedType(type);
                                setPage(1);
                            }}
                        >
                            {type}
                        </Badge>
                    ))}
                </div>

                {/* Events Grid */}
                {isLoading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="aspect-[16/9] rounded-xl" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-16">
                        <Calendar className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No events found</h3>
                        <p className="text-muted-foreground mb-6">
                            {search
                                ? "Try adjusting your search or filters"
                                : "No events are available at the moment"}
                        </p>
                        {search && (
                            <Button variant="outline" onClick={() => setSearch("")}>
                                Clear Search
                            </Button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                        <Button
                                            key={p}
                                            variant={page === p ? "default" : "outline"}
                                            size="icon"
                                            onClick={() => setPage(p)}
                                        >
                                            {p}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
