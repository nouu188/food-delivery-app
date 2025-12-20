import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { getAccessToken, clearTokens } from '@/services/api/client';
import userService from '@/services/api/user.service';
import { useUserStore } from '@/store/useUserStore';
import { UserProfile } from '@/types/api/user';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

    const inAuthGroup = segments[0] === '(auth)';
    const inMainGroup = segments[0] === '(main)';
    const inLaunch = segments[0] === 'launch';

    if (!isAuthenticated && inMainGroup) {
      // Redirect to login if trying to access protected route
      router.replace('/(auth)/Login');
    } else if (isAuthenticated && (inAuthGroup || inLaunch)) {
      // Redirect to home if already authenticated
      router.replace('/(main)/(tabs)/Home');
    }
  }, [isAuthenticated, segments, isLoading]);

  const checkAuth = async () => {
    try {
      const token = await getAccessToken();
      if (token) {
        // Verify token by fetching user profile
        const profile = await userService.getProfile();
        setProfile(profile);
        setUser(profile);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      await clearTokens();
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
    clearProfile();
    setIsAuthenticated(false);
    setUser(null);
    router.replace('/(auth)/Login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
