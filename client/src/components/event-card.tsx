"use client";

import Link from "next/link";
import { Calendar, MapPin, IndianRupee } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
    event: {
        id: string;
        name: string;
        description: string;
        type: string;
        startDate: string;
        location: string;
        city?: string;
        status: string;
        registrationFee?: number;
        capacity?: number;
        registered?: number;
    };
}

export function EventCard({ event }: EventCardProps) {
    const startDate = new Date(event.startDate);
    const spotsLeft = event.capacity ? event.capacity - (event.registered || 0) : null;

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            {/* Image */}
            <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 to-primary/5 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Calendar className="h-12 w-12 text-primary/30" />
                </div>
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    {event.status === "ACTIVE" && (
                        <Badge variant="success">Live</Badge>
                    )}
                </div>
                {spotsLeft !== null && spotsLeft < 20 && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="warning">Only {spotsLeft} spots left</Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {event.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {event.description}
                </p>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                            {startDate.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="text-muted-foreground/50">•</span>
                        <span>
                            {startDate.toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                            {event.location}
                            {event.city && `, ${event.city}`}
                        </span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-0 flex items-center justify-between">
                <div className="flex items-center gap-1 font-semibold text-lg">
                    <IndianRupee className="h-4 w-4" />
                    {event.registrationFee || "Free"}
                </div>
                <Button asChild size="sm">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
