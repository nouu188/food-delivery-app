import { Stack } from "expo-router";

export default function MainLayout() {
    return (
        <Stack>
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="restaurants" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
        </Stack>
    );
}
