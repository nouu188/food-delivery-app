// components/common/Header.tsx
import { ArrowLeft } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
  rightComponent?: React.ReactNode;
};

export default function Header({
  title,
  showBackButton = true,
  onBack,
  rightComponent,
}: HeaderProps) {
  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <View className="bg-YellowBase px-6 pt-12 pb-6"> {/* Tăng padding để đẹp hơn */}
      <View className="flex-row items-center justify-between">
        {/* Back button bên trái */}
        {showBackButton && (
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
            <ArrowLeft size={28} color="#000" />
          </TouchableOpacity>
        )}

        {/* Nếu không có back button thì thêm spacer để title vẫn giữa */}
        {!showBackButton && <View className="w-10" />}

        {/* Title ở giữa */}
        <Text className="text-3xl font-bold text-black flex-1 text-center">
          {title}
        </Text>

        {/* Right component (View History) */}
        <View className="min-w-[100px]">
          {rightComponent || <View className="w-10" />} 
        </View>
      </View>
    </View>
  );
}