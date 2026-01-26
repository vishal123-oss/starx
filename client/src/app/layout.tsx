import "./globals.css";

import type { Metadata } from "next";

import { AuthProvider } from "@/contexts/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { geist, inter } from "@/fonts";

export const metadata: Metadata = {
    title: "Xangoes | College Fest Management Platform",
    description: "A comprehensive platform for managing college festivals and events. Discover, register, and participate in amazing events near you.",
    keywords: ["college fest", "events", "hackathon", "competitions", "registration"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthProvider>
                        <Navigation />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                        <div className="fixed bottom-4 right-4 z-50">
                            <ThemeToggle />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
