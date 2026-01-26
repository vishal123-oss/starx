"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Lock, CheckCircle2, IndianRupee, Calendar, MapPin, Download } from "lucide-react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { apiClient } from "@/lib/api";

export default function BookEventPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState("");
    const [bookedTicket, setBookedTicket] = useState<any>(null);

    // Payment form state
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/login?redirect=/events/" + params.id + "/book");
            return;
        }
        if (isAuthenticated) {
            loadEvent();
        }
    }, [params.id, isAuthenticated, authLoading]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setBooking(true);

        if (!cardNumber || !cardName || !expiry || !cvv) {
            setError("Please fill all payment details");
            setBooking(false);
            return;
        }

        try {
            const paymentData = {
                cardNumber: cardNumber.replace(/\s/g, ""),
                cardName,
                expiry,
                cvv,
                amount: event.registrationFee,
                method: "card",
            };

            const result = await apiClient.bookEvent(params.id as string, paymentData);
            setBookedTicket(result.ticket);
        } catch (err: any) {
            setError(err.message || "Booking failed");
        } finally {
            setBooking(false);
        }
    };

    if (authLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Skeleton className="h-96 rounded-xl" />
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="grid lg:grid-cols-2 gap-8">
                    <Skeleton className="h-96 rounded-xl" />
                    <Skeleton className="h-96 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error && !event) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button asChild>
                    <Link href="/events">Browse Events</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="border-b bg-background">
                <div className="container mx-auto px-4 py-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={"/events/" + params.id}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Event
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
                    <p className="text-muted-foreground">
                        You&apos;re just one step away from registering for this event
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, "");
                                            const formatted = value.match(/.{1,4}/g)?.join(" ") || value;
                                            setCardNumber(formatted.slice(0, 19));
                                        }}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength={19}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input
                                        id="cardName"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            value={expiry}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                const formatted =
                                                    value.length >= 2
                                                        ? value.slice(0, 2) + "/" + value.slice(2, 4)
                                                        : value;
                                                setExpiry(formatted.slice(0, 5));
                                            }}
                                            placeholder="MM/YY"
                                            maxLength={5}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            value={cvv}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setCvv(value.slice(0, 3));
                                            }}
                                            placeholder="123"
                                            maxLength={3}
                                            type="password"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 p-4 rounded-lg bg-muted text-sm text-muted-foreground">
                                    <Lock className="h-4 w-4 shrink-0" />
                                    <span>
                                        This is a demo payment. No real transaction will be processed.
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-12"
                                    disabled={booking}
                                >
                                    {booking ? (
                                        "Processing..."
                                    ) : (
                                        <>
                                            Pay ₹{event?.registrationFee || 0}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{event?.name}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {event?.description?.slice(0, 100)}...
                                    </p>
                                </div>

                                <Separator />

                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {new Date(event?.startDate).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event?.location}, {event?.city}</span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Registration Fee</span>
                                    <span className="font-semibold">₹{event?.registrationFee || 0}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Service Fee</span>
                                    <span className="font-semibold">₹0</span>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Total</span>
                                    <div className="flex items-center gap-1 font-bold text-xl">
                                        <IndianRupee className="h-5 w-5" />
                                        {event?.registrationFee || 0}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="space-y-3">
                                    {[
                                        "Instant confirmation",
                                        "E-ticket sent to email",
                                        "Free cancellation up to 24h",
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Success Modal/Section */}
                {bookedTicket && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <Card className="max-w-md w-full">
                            <CardHeader className="text-center">
                                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <CardTitle className="text-2xl">Booking Successful!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="text-center">
                                    <p className="text-muted-foreground mb-4">
                                        Your ticket has been booked successfully. Scan the QR code below for check-in.
                                    </p>
                                    <div className="bg-white p-4 rounded-lg inline-block qr-container">
                                        <QRCode value={bookedTicket.id} size={200} />
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p><strong>Event:</strong> {event?.name}</p>
                                    <p><strong>Ticket ID:</strong> {bookedTicket.id.slice(0, 20)}...</p>
                                    <p><strong>Status:</strong> {bookedTicket.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={async () => {
                                            const qrElement = document.querySelector('.qr-container');
                                            if (qrElement) {
                                                const canvas = await html2canvas(qrElement as HTMLElement);
                                                const link = document.createElement('a');
                                                link.download = `ticket-${event?.id}.png`;
                                                link.href = canvas.toDataURL();
                                                link.click();
                                            }
                                        }}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download QR
                                    </Button>
                                    <Button asChild className="flex-1">
                                        <Link href="/my-bookings">View My Bookings</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
