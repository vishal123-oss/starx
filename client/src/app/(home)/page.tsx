import Link from "next/link";
import { ArrowRight, Calendar, CreditCard, Shield, Zap, Users, BarChart3 } from "lucide-react";

import { TrendingEventsSection } from "@/components/trending-events";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
                
                <div className="container mx-auto px-4 py-24 md:py-32 relative">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Zap className="h-4 w-4" />
                            The #1 College Fest Management Platform
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                            Manage Your College Fests{" "}
                            <span className="text-primary">Like Never Before</span>
                        </h1>
                        
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A comprehensive platform for managing college festivals and events. 
                            Centralized management, seamless registrations, and real-time tracking.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-12 px-8">
                                <Link href="/events">
                                    Browse Events
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8">
                                <Link href="/sign-up">Create Account</Link>
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>10,000+ Users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>500+ Events</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4" />
                                <span>50+ Colleges</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-24">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Everything You Need to Manage Events
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Powerful features designed to make event management effortless
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Calendar,
                            title: "Event Management",
                            description: "Create, manage, and track events with ease. Set dates, venues, and registration limits.",
                        },
                        {
                            icon: Users,
                            title: "Team Registration",
                            description: "Support for individual and team registrations with flexible member management.",
                        },
                        {
                            icon: CreditCard,
                            title: "Secure Payments",
                            description: "Integrated payment processing with multiple options and instant confirmations.",
                        },
                        {
                            icon: BarChart3,
                            title: "Analytics Dashboard",
                            description: "Real-time insights into registrations, revenue, and participant demographics.",
                        },
                        {
                            icon: Shield,
                            title: "Secure & Reliable",
                            description: "Enterprise-grade security with data encryption and secure authentication.",
                        },
                        {
                            icon: Zap,
                            title: "Lightning Fast",
                            description: "Optimized for speed with instant page loads and real-time updates.",
                        },
                    ].map((feature, index) => (
                        <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <feature.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Trending Events Section */}
            <TrendingEventsSection />

            {/* Stats Section */}
            <section className="bg-primary text-primary-foreground py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: "10K+", label: "Active Users" },
                            { value: "500+", label: "Events Hosted" },
                            { value: "50+", label: "Partner Colleges" },
                            { value: "₹10L+", label: "Transactions" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-primary-foreground/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-24">
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
                    <CardContent className="p-12 text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Get Started?
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            Join thousands of students and organizers who trust Project Xangoes for their event management needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="h-12 px-8">
                                <Link href="/events">
                                    Explore Events
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-12 px-8">
                                <Link href="/sign-up">Create Free Account</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
