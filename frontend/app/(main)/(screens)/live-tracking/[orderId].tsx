import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import orderService from "@/services/api/order.service";
import { Order, OrderStatus } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

const STATUS_STEPS = [
    { status: OrderStatus.PENDING, label: "Order Placed", icon: "check-circle" },
    { status: OrderStatus.CONFIRMED, label: "Confirmed", icon: "check-circle" },
    { status: OrderStatus.PREPARING, label: "Preparing", icon: "clock" },
    { status: OrderStatus.READY_FOR_PICKUP, label: "Ready", icon: "package" },
    { status: OrderStatus.PICKED_UP, label: "Picked Up", icon: "truck" },
    { status: OrderStatus.ON_THE_WAY, label: "On The Way", icon: "navigation" },
    { status: OrderStatus.DELIVERED, label: "Delivered", icon: "check-circle" },
];

export default function LiveTrackingScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async (showRefreshIndicator = false) => {
        if (!orderId) {
            Alert.alert('Error', 'Order ID is required');
            router.back();
            return;
        }

        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const orderData = await orderService.getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Order');
            if (!showRefreshIndicator) {
                router.back();
            }
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const getCurrentStepIndex = (status: OrderStatus): number => {
        const index = STATUS_STEPS.findIndex(step => step.status === status);
        return index !== -1 ? index : 0;
    };

    const isStepCompleted = (stepIndex: number, currentIndex: number): boolean => {
        return stepIndex <= currentIndex;
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Track Order" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <ActivityIndicator size="large" color="#E95322" />
                    <Text className="text-gray-500 mt-4">Loading order tracking...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Track Order" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center px-8">
                    <Text className="text-xl font-medium text-gray-600 text-center">Order not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const currentStepIndex = getCurrentStepIndex(order.status);

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Track Order" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => fetchOrder(true)}
                            tintColor="#E95322"
                        />
                    }
                >
                    <View className="bg-[#FFF5D6] rounded-2xl p-4 mb-6">
                        <Text className="text-[#070707] font-bold text-base">Order #{order.order_number}</Text>
                        <Text className="text-[#6B7280] text-sm mt-1">
                            {order.restaurant_name || 'Restaurant'} • {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </Text>
                        <Text className="text-[#E95322] font-bold text-lg mt-2">
                            ${order.total_amount.toFixed(2)}
                        </Text>
                    </View>

                    <Text className="text-[#070707] font-bold text-lg mb-4">Order Status</Text>

                    <View className="pl-4">
                        {STATUS_STEPS.map((step, index) => {
                            const isCompleted = isStepCompleted(index, currentStepIndex);
                            const isActive = index === currentStepIndex;

                            return (
                                <View key={step.status} className="flex-row mb-6">
                                    <View className="items-center mr-4">
                                        <View
                                            className="w-10 h-10 rounded-full items-center justify-center"
                                            style={{
                                                backgroundColor: isCompleted ? "#E95322" : "#E5E7EB",
                                            }}
                                        >
                                            <Feather
                                                name={step.icon as any}
                                                size={20}
                                                color={isCompleted ? "#FFFFFF" : "#9CA3AF"}
                                            />
                                        </View>
                                        {index < STATUS_STEPS.length - 1 && (
                                            <View
                                                className="w-0.5 h-12 mt-2"
                                                style={{
                                                    backgroundColor: isCompleted ? "#E95322" : "#E5E7EB",
                                                }}
                                            />
                                        )}
                                    </View>
                                    <View className="flex-1 pt-2">
                                        <Text
                                            className={`font-semibold ${
                                                isActive ? "text-[#E95322]" : isCompleted ? "text-[#070707]" : "text-[#9CA3AF]"
                                            }`}
                                        >
                                            {step.label}
                                        </Text>
                                        {isActive && (
                                            <Text className="text-[#6B7280] text-xs mt-1">In Progress...</Text>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {order.estimated_delivery && (
                        <View className="mt-6 bg-[#FFE3D6] rounded-2xl p-4">
                            <Text className="text-[#070707] font-semibold">Estimated Delivery</Text>
                            <Text className="text-[#E95322] font-bold text-lg mt-1">
                                {new Date(order.estimated_delivery).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                            </Text>
                        </View>
                    )}

                    {order.delivery_address && (
                        <View className="mt-4 bg-[#FFF5D6] rounded-2xl p-4">
                            <Text className="text-[#070707] font-semibold">Delivery Address</Text>
                            <Text className="text-[#6B7280] text-sm mt-2">
                                {typeof order.delivery_address === 'object'
                                    ? `${order.delivery_address.address_line}, ${order.delivery_address.ward}, ${order.delivery_address.district}, ${order.delivery_address.city}`
                                    : order.delivery_address}
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => router.push(`/orders/${order.id}`)}
                        className="mt-6 bg-[#E95322] rounded-full py-4"
                        activeOpacity={0.9}
                    >
                        <Text className="text-white text-center font-semibold text-base">View Order Details</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
