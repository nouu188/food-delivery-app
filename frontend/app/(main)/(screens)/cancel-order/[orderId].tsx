import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import orderService from "@/services/api/order.service";
import { Order, CancelledBy } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

const REASONS = [
    "Changed my mind",
    "Ordered by mistake",
    "Taking too long",
    "Found a better option",
    "Personal reasons",
];

export default function CancelOrderScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCancelling, setIsCancelling] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number>(0);
    const [otherReason, setOtherReason] = useState("");

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async () => {
        if (!orderId) {
            Alert.alert('Error', 'Order ID is required');
            router.back();
            return;
        }

        try {
            setIsLoading(true);
            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Order');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        if (!order) return;

        const cancellationReason = otherReason.trim() || REASONS[selectedIndex];

        if (!cancellationReason) {
            Alert.alert('Error', 'Please provide a cancellation reason');
            return;
        }

        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        setIsCancelling(true);
                        try {
                            await orderService.cancelOrder(order.id, {
                                cancellation_reason: cancellationReason,
                                cancelled_by: CancelledBy.CUSTOMER,
                            });

                            router.replace({
                                pathname: '/cancel-order/success',
                                params: { orderId: order.id },
                            });
                        } catch (error) {
                            showErrorAlert(error, 'Failed to Cancel Order');
                        } finally {
                            setIsCancelling(false);
                        }
                    },
                },
            ]
        );
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Cancel Order" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <ActivityIndicator size="large" color="#E95322" />
                    <Text className="text-gray-500 mt-4">Loading order details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Cancel Order" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center px-8">
                    <Text className="text-xl font-medium text-gray-600 text-center">Order not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Cancel Order" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                    <View className="bg-[#FFF5D6] rounded-2xl p-4 mb-6">
                        <Text className="text-[#070707] font-bold text-base">Order #{order.order_number}</Text>
                        <Text className="text-[#6B7280] text-sm mt-1">
                            {order.restaurant_name || 'Restaurant'} • {order.items && Array.isArray(order.items) ? order.items.length : 0} item{order.items && Array.isArray(order.items) && order.items.length > 1 ? 's' : ''}
                        </Text>
                        <Text className="text-[#E95322] font-bold text-lg mt-2">
                            ${order.total_amount}
                        </Text>
                    </View>

                    <Text className="text-[#6B7280] text-sm leading-5 mb-4">
                        Please let us know why you want to cancel this order. Your feedback helps us improve our service.
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
                        onPress={handleCancelOrder}
                        disabled={isCancelling}
                        className="self-center mt-10 px-12 py-3 rounded-full items-center justify-center"
                        style={{ backgroundColor: isCancelling ? "#9CA3AF" : "#E95322", minWidth: 140 }}
                    >
                        {isCancelling ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold">Submit</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
