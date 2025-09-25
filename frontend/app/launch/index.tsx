import { Logo_orange } from "@/svgs/SVGLaunch";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const LaunchScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-YellowBase justify-center items-center">
      {/* <Text className="text-orange-600">Launch Screen</Text> */}
      <Logo_orange />
    </SafeAreaView>
  );
};

export default LaunchScreen;
