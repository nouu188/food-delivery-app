import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const REASONS = [
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum dolor sit amet",
    "Lorem ipsum dolor sit amet",
];

export default function CancelOrderScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [otherReason, setOtherReason] = React.useState("");

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Cancel Order" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                    <Text className="text-[#6B7280] text-sm leading-5">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent pellentesque congue lorem, vel
                        tincidunt tortor.
                    </Text>

                    <View className="mt-6">
                        {REASONS.map((label, idx) => {
                            const active = idx === selectedIndex;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    activeOpacity={0.8}
                                    onPress={() => setSelectedIndex(idx)}
                                    className="py-4 border-b"
                                    style={{ borderBottomColor: "#FFD8C7" }}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-[#070707] font-medium">{label}</Text>
                                        <View
                                            className="w-4 h-4 rounded-full items-center justify-center"
                                            style={{ borderWidth: 1.5, borderColor: "#E95322" }}
                                        >
                                            {active && (
                                                <View
                                                    className="w-2.5 h-2.5 rounded-full"
                                                    style={{ backgroundColor: "#E95322" }}
                                                />
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <View className="mt-6">
                        <Text className="text-[#6B7280] font-semibold mb-3">Others</Text>
                        <View className="rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                            <TextInput
                                value={otherReason}
                                onChangeText={setOtherReason}
                                placeholder="Others reason..."
                                placeholderTextColor="#9CA3AF"
                                multiline
                                style={{ minHeight: 56, color: "#070707" }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push({ pathname: "/cancel-order/success", params: { orderId } })}
                        className="self-center mt-10 px-12 py-3 rounded-full"
                        style={{ backgroundColor: "#E95322" }}
                    >
                        <Text className="text-white font-semibold">Submit</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
