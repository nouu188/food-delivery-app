import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const welcome = () => {
  return (
    <SafeAreaView className="flex">
      <Text>Welcome Screen</Text>
    </SafeAreaView>
  );
};

export default welcome;
