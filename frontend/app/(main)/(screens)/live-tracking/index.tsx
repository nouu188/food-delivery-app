import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function LiveTrackingScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Live Tracking" />

            <View className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                <View className="flex-1" style={{ backgroundColor: "#F3F4F6" }}>
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-[#9CA3AF] font-semibold">Map preview</Text>
                    </View>

                    <View className="absolute bottom-16 right-4">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-10 h-10 rounded-full items-center justify-center mb-3"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Feather name="phone" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Feather name="message-circle" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                        <View className="rounded-3xl px-6 py-4" style={{ backgroundColor: "#FFFFFF" }}>
                            <View className="flex-row items-center justify-between">
                                <Text className="font-bold text-[#070707]">Delivery goes your way</Text>
                                <Text className="text-[#6B7280] text-xs">01 Sep 24</Text>
                            </View>

                            <View
                                className="mt-4 rounded-full overflow-hidden"
                                style={{ backgroundColor: "#E5E7EB", height: 10 }}
                            >
                                <View style={{ width: "55%", height: 10, backgroundColor: "#E95322" }} />
                            </View>

                            <View className="flex-row items-center justify-between mt-4">
                                <View className="items-start">
                                    <Text className="text-[#E95322] font-bold text-xs">Delivery goes your way</Text>
                                    <Text className="text-[#6B7280] text-xs">06:20 PM</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#E95322] font-bold text-xs">Pick up your delivery</Text>
                                    <Text className="text-[#6B7280] text-xs">07:15 PM</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => router.push("/live-tracking/delivered")}
                                className="self-center mt-6 px-10 py-3 rounded-full"
                                style={{ backgroundColor: "#E95322" }}
                            >
                                <Text className="text-white font-semibold">Mark Delivered</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
