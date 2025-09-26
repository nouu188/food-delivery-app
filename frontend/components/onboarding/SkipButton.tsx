import { NextIconArrow } from "@/svgs/SVGOnboarding";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const SkipButton = () => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center"
      onPress={() => router.replace("/login/login")}
    >
      <Text className="font-semibold text-base text-OrangeBase mr-2">Skip</Text>
      <NextIconArrow />
    </TouchableOpacity>
  );
};

export default SkipButton;
