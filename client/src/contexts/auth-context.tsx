"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { apiClient } from "@/lib/api";

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            // Try to fetch user data
            apiClient
                .getMe()
                .then((data) => {
                    setUser(data.user);
                })
                .catch(() => {
                    // Token invalid, clear it
                    localStorage.removeItem("token");
                    setToken(null);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const data = await apiClient.login(email, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
    };

    const register = async (email: string, password: string, name: string) => {
        const data = await apiClient.register(email, password, name);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user && !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
