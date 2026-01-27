"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Calendar, CalendarDays, LayoutDashboard, Ticket, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export function Navigation() {
    const pathname = usePathname();
    const { isAuthenticated, user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItems = [
        { href: "/", label: "Home", icon: null },
        { href: "/events", label: "Events", icon: Calendar },
        ...(isAuthenticated
            ? [
                  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { href: "/calendar", label: "Calendar", icon: CalendarDays },
                  { href: "/my-bookings", label: "My Bookings", icon: Ticket },
                  { href: "/admin/events/create", label: "Create", icon: Plus },
              ]
            : []),
    ];

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">X</span>
                        </div>
                        <span className="font-bold text-xl hidden sm:block">Xangoes</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons / User Menu */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <div className="hidden md:flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                            {user?.name ? getInitials(user.name) : "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">{user?.name}</span>
                                </div>
                                <Button variant="outline" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="hidden md:flex items-center gap-2">
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/login">Sign In</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/sign-up">Get Started</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-background">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                        pathname === item.href
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                    )}
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {item.label}
                                </Link>
                            );
                        })}

                        <div className="pt-4 border-t space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                                {user?.name ? getInitials(user.name) : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">{user?.name}</span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                            Sign In
                                        </Link>
                                    </Button>
                                    <Button asChild className="w-full">
                                        <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                                            Get Started
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
