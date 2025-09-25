import ButtonComponent from "@/components/Button";
import { Logo_yellow } from "@/svgs/SVGLaunch";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Welcome = () => {
  return (
    <SafeAreaView className="flex-1 bg-OrangeBase justify-center items-center">
      <Logo_yellow />
      <Text className="font-medium text-Font_2 my-10 text-center text-base px-4 leading-6">
        Lorem ipsum dolor sit amet, consectetur{"\n"}
        adipiscing elit, sed do eiusmod.
      </Text>
      <ButtonComponent title="Log In" background="YellowBase" />
      <ButtonComponent title="Sign Up" background="YellowBase" />
    </SafeAreaView>
  );
};

export default Welcome;
