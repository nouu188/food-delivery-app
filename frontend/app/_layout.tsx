import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";
import { TamaguiProvider } from "tamagui";
import { config } from "../tamagui.config";

export default function RootLayout() {
    return (
        <TamaguiProvider config={config}>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }} />
        </TamaguiProvider>
    );
}
