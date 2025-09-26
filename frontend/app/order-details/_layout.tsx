import { Stack } from "expo-router";

export default function OrderDetailsLayout() {
    return (
        <Stack>
            <Stack.Screen name="[id]" options={{ title: "Order Details" }} />
            <Stack.Screen name="tracking/[id]" options={{ title: "Order Tracking" }} />
        </Stack>
    );
}
