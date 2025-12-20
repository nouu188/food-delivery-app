import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
    return (
        <ErrorBoundary>
            <TamaguiProvider config={config}>
                <AuthProvider>
                    <StatusBar style="auto" />
                    <Stack screenOptions={{ headerShown: false }} />
                </AuthProvider>
            </TamaguiProvider>
        </ErrorBoundary>
    );
}
