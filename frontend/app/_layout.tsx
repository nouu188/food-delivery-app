// app/_layout.tsx
import { defaultConfig } from '@tamagui/config/v4';
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { createTamagui } from 'tamagui';
import "./global.css";

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#FFB341" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        {/* Các màn khác */}
        <Stack.Screen name="IndexScreen" />
        {/* <Stack.Screen name="onboarding" /> */}
      </Stack>
      <Toast />
    </>
  );
}
