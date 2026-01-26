"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    MapPin,
    Users,
    IndianRupee,
    Clock,
    Phone,
    ArrowLeft,
    Share2,
    Heart,
    Trophy,
    CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadEvent();
    }, [params.id]);

    const loadEvent = async () => {
        try {
            const data = await apiClient.getEventById(params.id as string);
            setEvent(data.event);
        } catch (err: any) {
            setError(err.message || "Failed to load event");
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!isAuthenticated) {
            router.push("/login?redirect=/events/" + params.id + "/book");
            return;
        }
        router.push("/events/" + params.id + "/book");
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="aspect-[21/9] rounded-2xl mb-8" />
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-2/3" />
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
                <p className="text-muted-foreground mb-6">{error || "The event you&apos;re looking for doesn&apos;t exist."}</p>
                <Button asChild>
                    <Link href="/events">Browse Events</Link>
                </Button>
            </div>
        );
    }

    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : null;
    const spotsLeft = event.capacity ? event.capacity - (event.registered || 0) : null;

    return (
        <div className="min-h-screen">
            {/* Back Navigation */}
            <div className="border-b bg-background/95 backdrop-blur sticky top-16 z-40">
                <div className="container mx-auto px-4 py-3">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/events">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Events
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Hero Image */}
                <div className="aspect-[21/9] bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl mb-8 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Calendar className="h-24 w-24 text-primary/20" />
                    </div>
                    <div className="absolute top-4 left-4 flex gap-2">
                        <Badge variant="secondary" className="text-sm">{event.type}</Badge>
                        {event.status === "ACTIVE" && (
                            <Badge variant="success" className="text-sm">Live</Badge>
                        )}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                        <Button size="icon" variant="secondary">
                            <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Title & Description */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.name}</h1>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Date & Time */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    Date & Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                                        <span className="text-xs font-medium">
                                            {startDate.toLocaleDateString("en-US", { month: "short" })}
                                        </span>
                                        <span className="text-xl font-bold">
                                            {startDate.getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {startDate.toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p className="text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {startDate.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                            {endDate && (
                                                <>
                                                    {" - "}
                                                    {endDate.toLocaleTimeString("en-US", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    Location
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">{event.location}</p>
                                <p className="text-muted-foreground">
                                    {event.city}, {event.state}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Prize Money */}
                        {event.prizeMoney && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-primary" />
                                        Prize Money
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        {event.prizeMoney.first && (
                                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 border border-yellow-500/20">
                                                <p className="text-xs text-muted-foreground mb-1">1st Prize</p>
                                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                                    ₹{event.prizeMoney.first.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        {event.prizeMoney.second && (
                                            <div className="text-center p-4 rounded-xl bg-muted/50 border">
                                                <p className="text-xs text-muted-foreground mb-1">2nd Prize</p>
                                                <p className="text-2xl font-bold">
                                                    ₹{event.prizeMoney.second.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        {event.prizeMoney.third && (
                                            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
                                                <p className="text-xs text-muted-foreground mb-1">3rd Prize</p>
                                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                                    ₹{event.prizeMoney.third.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Rules */}
                        {event.rules && event.rules.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Rules & Guidelines</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {event.rules.map((rule: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                                <span>{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}

                        {/* Contact */}
                        {event.contact && event.contact.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-primary" />
                                        Contact
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {event.contact.map((contact: string, idx: number) => (
                                            <a
                                                key={idx}
                                                href={`tel:${contact}`}
                                                className="flex items-center gap-2 text-primary hover:underline"
                                            >
                                                <Phone className="h-4 w-4" />
                                                {contact}
                                            </a>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <Card className="overflow-hidden">
                                <CardContent className="p-6 space-y-6">
                                    {/* Price */}
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Registration Fee</p>
                                        <div className="flex items-baseline gap-1">
                                            <IndianRupee className="h-6 w-6" />
                                            <span className="text-4xl font-bold">
                                                {event.registrationFee || "Free"}
                                            </span>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Spots */}
                                    {spotsLeft !== null && (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>Available Spots</span>
                                            </div>
                                            <span className="font-semibold">
                                                {spotsLeft} / {event.capacity}
                                            </span>
                                        </div>
                                    )}

                                    {/* Progress Bar */}
                                    {event.capacity && (
                                        <div className="space-y-2">
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary rounded-full transition-all"
                                                    style={{
                                                        width: `${((event.registered || 0) / event.capacity) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {event.registered || 0} people have registered
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        size="lg"
                                        className="w-full h-12"
                                        onClick={handleBookNow}
                                    >
                                        Book Now
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        Secure payment • Instant confirmation
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
