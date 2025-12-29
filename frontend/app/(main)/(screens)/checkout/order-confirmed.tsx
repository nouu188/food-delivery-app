import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import orderService from "@/services/api/order.service";
import { Order } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

export default function OrderConfirmedScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        } else {
            setIsLoading(false);
        }
    }, [orderId]);

    const fetchOrder = async () => {
        if (!orderId) return;

        try {
            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            showErrorAlert(error, "Failed to Load Order");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDeliveryTime = (dateString: string | null) => {
        if (!dateString) return "Coming soon";

        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="" showBackButton={false} />

            <View className="flex-1 items-center justify-center px-10">
                {isLoading ? (
                    <ActivityIndicator size="large" color="#E95322" />
                ) : (
                    <>
                        <View
                            className="w-32 h-32 rounded-full items-center justify-center mb-8"
                            style={{ backgroundColor: "#E5F6E5" }}
                        >
                            <Feather name="check-circle" size={64} color="#22C55E" />
                        </View>

                        <Text className="text-2xl font-extrabold text-[#070707]">Order Confirmed!</Text>
                        <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                            Your order has been successfully{`\n`}placed
                        </Text>

                        {order && (
                            <View className="mt-6 bg-white rounded-2xl px-6 py-4 w-full">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-[#6B7280]">Order Number</Text>
                                    <Text
                                        className="font-semibold text-[#070707]"
                                        numberOfLines={1}
                                        ellipsizeMode="middle"
                                        style={{ flexShrink: 1, textAlign: "right", marginLeft: 12 }}
                                    >
                                        {order.order_number}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-[#6B7280]">Total Amount</Text>
                                    <Text className="font-bold text-[#E95322]">${order.total_amount}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-[#6B7280]">Estimated Delivery</Text>
                                    <Text
                                        className="font-semibold text-[#070707]"
                                        numberOfLines={1}
                                        style={{ flexShrink: 1, textAlign: "right", marginLeft: 12 }}
                                    >
                                        {formatDeliveryTime(order.estimated_delivery)}
                                    </Text>
                                </View>
                            </View>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                if (order) {
                                    router.replace(`/orders/${order.id}`);
                                } else {
                                    router.replace("/(main)/(tabs)/Orders");
                                }
                            }}
                            className="mt-8 px-10 py-4 rounded-full"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Text className="text-white font-semibold text-base">Track My Order</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => router.replace("/(main)/(tabs)/Home")}
                            className="mt-4"
                        >
                            <Text className="text-[#E95322] font-semibold">Back to Home</Text>
                        </TouchableOpacity>

                        <Text className="mt-12 text-center text-[#6B7280] text-sm">
                            If you have any questions, please reach out{`\n`}directly to our customer support
                        </Text>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
