import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CancelOrderSuccess() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="" showBackButton={true} />
            <View className="flex-1 items-center justify-center px-10">
                <View
                    className="w-40 h-40 rounded-full items-center justify-center"
                    style={{ borderWidth: 4, borderColor: "#E95322" }}
                >
                    <Feather name="check-circle" size={64} color="#22C55E" />
                </View>

                <Text className="mt-10 text-2xl font-extrabold text-[#070707]">Order Cancelled!</Text>
                <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                    Your order has been successfully{`\n`}cancelled
                </Text>

                <Text className="mt-16 text-center text-[#6B7280]">
                    If you have any question reach directly to our{`\n`}customer support
                </Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    className="mt-10 px-10 py-3 rounded-full"
                    style={{ backgroundColor: "#E95322" }}
                    onPress={() => router.replace("/(main)/(tabs)/Orders")}
                >
                    <Text className="text-white font-semibold">Back to Orders</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
