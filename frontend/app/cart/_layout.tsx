import { Stack } from "expo-router";

export default function CartLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Shopping Cart" }} />
            <Stack.Screen name="checkout" options={{ title: "Checkout" }} />
        </Stack>
    );
}
