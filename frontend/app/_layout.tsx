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

// Ignore keep awake warning in development
LogBox.ignoreLogs([
    'Unable to activate keep awake',
    'SafeAreaView has been deprecated'
]);

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
