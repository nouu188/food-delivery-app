import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
    return (
        <>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="food/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="IndexScreen" />
                {/* <Stack.Screen name="onboarding" /> */}
            </Stack>
        </>
    );
}
