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

export default function Header({ title, showBackButton = true, onBack, rightComponent }: HeaderProps) {
    const handleBack = () => {
        if (onBack) onBack();
        else router.back();
    };

    return (
        <View className="bg-YellowBase px-6 pt-12 pb-6">
            <View className="flex-row items-center justify-between relative">
                {showBackButton && (
                    <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="absolute left-0 z-10">
                        <ArrowLeft size={28} color="#000" />
                    </TouchableOpacity>
                )}

                <View className="flex-1">
                    <Text className="text-3xl font-bold text-[#F8F8F8] text-center">{title}</Text>
                </View>

                {rightComponent && <View className="absolute right-0 z-10">{rightComponent}</View>}
            </View>
        </View>
    );
}
