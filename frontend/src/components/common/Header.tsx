import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type AuthHeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function Header({
  title,
  showBackButton = true,
  onBack,
}: AuthHeaderProps) {

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-row items-center justify-center px-8 py-14 m-3">
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBack}   
          className="mr-4"
          activeOpacity={0.7}
        >
          <ArrowLeft />
        </TouchableOpacity>
      )}

      <Text className="text-3xl font-bold text-Font_2 flex-1 text-center mr-8">
        {title}
      </Text>
    </View>
  );
}
