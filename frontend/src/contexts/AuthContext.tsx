import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import { getAccessToken, clearTokens } from "@/services/api/client";
import userService from "@/services/api/user.service";
import { useUserStore } from "@/store/useUserStore";
import { UserProfile } from "@/types/api/user";

interface AuthContextType {
    isAuthenticated: boolean;
    isGuest: boolean;
    isLoading: boolean;
    user: UserProfile | null;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    continueAsGuest: () => Promise<void>;
    exitGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const GUEST_MODE_KEY = "guest_mode";

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<UserProfile | null>(null);
    const router = useRouter();
    const segments = useSegments();
    const { setProfile, clearProfile } = useUserStore();

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Protect routes based on auth status
    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";
        const inMainGroup = segments[0] === "(main)";
        const inLaunch = segments[0] === "launch";

        if (!isAuthenticated && !isGuest && inMainGroup) {
            // Redirect to login if trying to access protected route
            router.replace("/(auth)/Login");
        } else if (isAuthenticated && (inAuthGroup || inLaunch)) {
            // Redirect to home if already authenticated
            router.replace("/(main)/(tabs)/Home");
        }
    }, [isAuthenticated, isGuest, segments, isLoading]);

    const checkAuth = async () => {
        try {
            const token = await getAccessToken();
            if (token) {
                await AsyncStorage.removeItem(GUEST_MODE_KEY);
                setIsGuest(false);
                // Verify token by fetching user profile
                const profile = await userService.getProfile();
                setProfile(profile);
                setUser(profile);
                setIsAuthenticated(true);
            } else {
                const guestFlag = await AsyncStorage.getItem(GUEST_MODE_KEY);
                setIsGuest(guestFlag === "true");
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.log("[Auth] Check error:", error);
            setIsAuthenticated(false);
            setIsGuest(false);
            setUser(null);
            await clearTokens();
            await AsyncStorage.removeItem(GUEST_MODE_KEY);
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async () => {
        // Called after successful login
        await checkAuth();
    };

    const signOut = async () => {
        await clearTokens();
        await AsyncStorage.removeItem(GUEST_MODE_KEY);
        clearProfile();
        setIsAuthenticated(false);
        setIsGuest(false);
        setUser(null);
        router.replace("/launch/welcome");
    };

    const continueAsGuest = async () => {
        await clearTokens();
        await AsyncStorage.setItem(GUEST_MODE_KEY, "true");
        clearProfile();
        setIsAuthenticated(false);
        setIsGuest(true);
        setUser(null);
    };

    const exitGuest = async () => {
        await AsyncStorage.removeItem(GUEST_MODE_KEY);
        setIsGuest(false);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isGuest, isLoading, user, signIn, signOut, continueAsGuest, exitGuest }}
        >
            {children}
        </AuthContext.Provider>
    );
}
