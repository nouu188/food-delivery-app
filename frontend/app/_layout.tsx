import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { createTamagui, TamaguiProvider, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="food/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="IndexScreen" />
                {/* <Stack.Screen name="onboarding" /> */}
            </Stack>
        </TamaguiProvider>
    );
}
