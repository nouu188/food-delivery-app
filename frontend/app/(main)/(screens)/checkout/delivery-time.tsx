import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEPS = [
    { label: "Your order has been accepted", time: "2 min" },
    { label: "The restaurant is preparing your order", time: "5 min" },
    { label: "The delivery is on his way", time: "10 min" },
    { label: "Your order has been delivered", time: "8 min" },
];

export default function DeliveryTimeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Delivery time" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <Text className="text-[#070707] font-bold">Shipping Address</Text>
                <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                    <Text className="text-[#070707] font-semibold" numberOfLines={1}>
                        778 Locust View Drive Oakland, CA
                    </Text>
                </View>

                <View className="mt-6 rounded-3xl overflow-hidden" style={{ backgroundColor: "#F3F4F6", height: 220 }}>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-[#9CA3AF] font-semibold">Map preview</Text>
                    </View>
                </View>

                <View className="mt-6 flex-row items-center justify-between">
                    <View>
                        <Text className="text-[#070707] font-bold">Delivery Time</Text>
                        <Text className="text-[#6B7280] text-xs mt-1">Estimated Delivery</Text>
                    </View>
                    <Text className="text-[#E95322] font-extrabold">25 mins</Text>
                </View>

                <View className="mt-6">
                    {STEPS.map((s, idx) => (
                        <View key={idx} className="flex-row items-center justify-between py-2">
                            <View className="flex-row items-center">
                                <View
                                    className="w-2.5 h-2.5 rounded-full mr-3"
                                    style={{ backgroundColor: idx <= 1 ? "#E95322" : "#E5E7EB" }}
                                />
                                <Text className="text-[#6B7280]">{s.label}</Text>
                            </View>
                            <Text className="text-[#6B7280]">{s.time}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row justify-between mt-10 pb-10">
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.replace("/Home")}
                        className="px-8 py-3 rounded-full"
                        style={{ backgroundColor: "#FFE3D6" }}
                    >
                        <Text className="text-[#E95322] font-semibold">Return Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push("/live-tracking")}
                        className="px-8 py-3 rounded-full"
                        style={{ backgroundColor: "#E95322" }}
                    >
                        <Text className="text-white font-semibold">Track Order</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
