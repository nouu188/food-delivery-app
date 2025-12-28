import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Star } from "@tamagui/lucide-icons";
import { useToastStore } from "@/store/useToastStore";

export default function OrderDeliveredScreen() {
    const router = useRouter();
    const showToast = useToastStore((s) => s.show);
    const { orderId } = useLocalSearchParams<{ orderId?: string }>();
    const [rating, setRating] = React.useState(5);

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="" showBackButton={true} />

            <View className="flex-1 items-center justify-center px-10">
                <View
                    className="w-40 h-40 rounded-full items-center justify-center"
                    style={{ borderWidth: 4, borderColor: "#E95322" }}
                >
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E95322" }} />
                </View>

                <Text className="mt-10 text-2xl font-extrabold text-[#070707]">iOrder Delivered!</Text>
                <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                    Your order has been successfully{`\n`}delivered, enjoy it!
                </Text>

                <Text className="mt-10 text-[#6B7280] font-semibold">Rate your delivery</Text>

                <View className="flex-row mt-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                        const active = i + 1 <= rating;
                        return (
                            <TouchableOpacity key={i} activeOpacity={0.8} onPress={() => setRating(i + 1)}>
                                <Star
                                    size={20}
                                    color="#E95322"
                                    fill={active ? "#E95322" : "transparent"}
                                    strokeWidth={2}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text className="mt-16 text-center text-[#6B7280]">
                    If you have any questions, please reach out{`\n`}directly to our customer support
                </Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (!orderId) {
                            showToast({ type: "error", title: "Error", message: "Order ID not found" });
                            router.back();
                            return;
                        }

                        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                        if (!uuidRegex.test(orderId)) {
                            showToast({ type: "error", title: "Error", message: "Invalid order format" });
                            router.back();
                            return;
                        }

                        router.push(`/review/${orderId}`);
                    }}
                    className="mt-10 px-12 py-3 rounded-full"
                    style={{ backgroundColor: "#E95322" }}
                >
                    <Text className="text-white font-semibold">Leave a Review</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => router.push("/(main)/(tabs)/Orders")}
                    className="mt-4 px-12 py-3 rounded-full"
                    style={{ backgroundColor: "#FFE3D6" }}
                >
                    <Text className="text-[#E95322] font-semibold">View My Orders</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
