import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import ToastHost from "@/components/common/ToastHost";
import ConfirmHost from "@/components/common/ConfirmHost";
import { LogBox } from "react-native";

// Ignore specific warnings and errors in development
LogBox.ignoreLogs([
    'Unable to activate keep awake',
    'SafeAreaView has been deprecated',
    'Possible Unhandled Promise Rejection', // Handled by our error handlers
]);

// Disable console.error from showing red screen for handled errors
if (__DEV__) {
    const originalConsoleError = console.error;
    console.error = (...args) => {
        // Filter out API errors (they're handled by our toast system)
        const errorMessage = args[0]?.toString() || '';
        if (
            errorMessage.includes('[API Error]') ||
            errorMessage.includes('Network Error') ||
            errorMessage.includes('AxiosError')
        ) {
            // Log to console but don't trigger red screen
            console.log('[Handled Error]', ...args);
            return;
        }
        // For other errors, show them normally
        originalConsoleError(...args);
    };
}

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <TamaguiProvider config={config}>
                <AuthProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                    <ToastHost />
                    <ConfirmHost />
                </AuthProvider>
            </TamaguiProvider>
        </ErrorBoundary>
    );
}
