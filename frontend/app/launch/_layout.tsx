import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }} />
    // <Stack screenOptions={{ headerShown: false }}>
    //   <Stack.Screen name="Welcome" />
    //   <Stack.Screen name="First" />
    // </Stack>
  );
};

export default _layout;
