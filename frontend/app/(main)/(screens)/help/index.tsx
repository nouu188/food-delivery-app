import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function HelpScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Help" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <Text className="text-[#6B7280] text-sm leading-5">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel
                    tincidunt tortor.
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/support")}
                    className="mt-10 py-5 border-b flex-row items-center"
                    style={{ borderBottomColor: "#FFD8C7" }}
                >
                    <View className="flex-1">
                        <Text className="font-semibold text-[#070707]">Help with the order</Text>
                        <Text className="text-xs text-[#6B7280] mt-1">Support</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#E95322" />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push("/support")}
                    className="py-5 border-b flex-row items-center"
                    style={{ borderBottomColor: "#FFD8C7" }}
                >
                    <View className="flex-1">
                        <Text className="font-semibold text-[#070707]">Help center</Text>
                        <Text className="text-xs text-[#6B7280] mt-1">General Information</Text>
                    </View>
                    <Feather name="chevron-right" size={18} color="#E95322" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
