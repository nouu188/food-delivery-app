import { Stack } from "expo-router";

export default function PaymentLayout() {
    return (
        <Stack>
            <Stack.Screen name="methods" options={{ title: "Payment Methods" }} />
            <Stack.Screen name="process" options={{ title: "Processing Payment" }} />
            <Stack.Screen name="success" options={{ title: "Payment Success" }} />
        </Stack>
    );
}
