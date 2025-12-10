// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "./global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#FFB341" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />   

        {/* Các màn auth */}
        <Stack.Screen name="auth/forgotPassword" />
        <Stack.Screen name="auth/verifyOTP" />
        <Stack.Screen name="auth/setPassword" />

        {/* Các màn khác */}
        <Stack.Screen name="IndexScreen" />
        {/* <Stack.Screen name="onboarding" /> */}
      </Stack>
    </>
  );
}