import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

const _layout = () => {
  return (
    <>
      <StatusBar backgroundColor="#F5CB58" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StepA" />
      </Stack>
    </>
  );
};

export default _layout;
