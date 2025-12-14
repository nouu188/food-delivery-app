import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { TamaguiProvider } from 'tamagui'
import { config } from "../tamagui.config";

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="IndexScreen" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/signup" />
                <Stack.Screen name="(main)/(tabs)" />
                <Stack.Screen name="(main)/food/[id]" />
                <Stack.Screen name="(onboarding)" />
                <Stack.Screen name="launch" />
            </Stack>
        </TamaguiProvider>
    );
}
