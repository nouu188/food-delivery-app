import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import orderService from "@/services/api/order.service";
import { Order, OrderStatus } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

export default function LiveTrackingScreen() {
    const router = useRouter();
    const { orderId } = useLocalSearchParams<{ orderId?: string }>();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (!orderId) {
            Alert.alert('Error', 'Order ID is required', [
                { text: 'OK', onPress: () => router.back() }
            ]);
            return;
        }
        fetchOrder();
    }, [orderId]);

    const fetchOrder = async (showRefreshIndicator = false) => {
        if (!orderId) return;

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

    const handleCallDriver = () => {
        Alert.alert(
            'Call Driver',
            'Contact driver for delivery updates?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Call',
                    onPress: () => {
                        Linking.openURL('tel:+1234567890').catch(() => {
                            Alert.alert('Error', 'Unable to make phone call');
                        });
                    }
                }
            ]
        );
    };

    const handleMessageDriver = () => {
        Alert.alert('Message Driver', 'Messaging feature coming soon!');
    };

    const handleMarkDelivered = () => {
        if (!orderId) return;

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(orderId)) {
            Alert.alert('Error', 'Invalid order format');
            return;
        }

        router.push(`/live-tracking/delivered?orderId=${orderId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: '2-digit' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const getProgressPercentage = (status: OrderStatus): number => {
        const statusMap: Record<OrderStatus, number> = {
            [OrderStatus.PENDING]: 10,
            [OrderStatus.CONFIRMED]: 20,
            [OrderStatus.PREPARING]: 40,
            [OrderStatus.READY_FOR_PICKUP]: 60,
            [OrderStatus.PICKED_UP]: 70,
            [OrderStatus.ON_THE_WAY]: 85,
            [OrderStatus.DELIVERED]: 100,
            [OrderStatus.COMPLETED]: 100,
            [OrderStatus.CANCELLED]: 0,
            [OrderStatus.REFUNDED]: 0,
            [OrderStatus.FAILED]: 0,
        };
        return statusMap[status] || 0;
    };

    const getStatusMessage = (status: OrderStatus): string => {
        const messages: Record<OrderStatus, string> = {
            [OrderStatus.PENDING]: 'Order placed, waiting confirmation',
            [OrderStatus.CONFIRMED]: 'Order confirmed by restaurant',
            [OrderStatus.PREPARING]: 'Your food is being prepared',
            [OrderStatus.READY_FOR_PICKUP]: 'Order ready for pickup',
            [OrderStatus.PICKED_UP]: 'Driver has picked up your order',
            [OrderStatus.ON_THE_WAY]: 'Driver is on the way',
            [OrderStatus.DELIVERED]: 'Order has been delivered',
            [OrderStatus.COMPLETED]: 'Order completed',
            [OrderStatus.CANCELLED]: 'Order cancelled',
            [OrderStatus.REFUNDED]: 'Order refunded',
            [OrderStatus.FAILED]: 'Order failed',
        };
        return messages[status] || 'Processing your order';
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Live Tracking" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <ActivityIndicator size="large" color="#E95322" />
                    <Text className="text-gray-500 mt-4">Loading tracking information...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Live Tracking" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center px-8">
                    <Feather name="alert-circle" size={60} color="#E95322" />
                    <Text className="text-xl font-medium text-gray-600 text-center mt-4">Order not found</Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="mt-6 px-8 py-3 rounded-full bg-[#E95322]"
                    >
                        <Text className="text-white font-semibold">Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const progress = getProgressPercentage(order.status);
    const canMarkDelivered = order.status === OrderStatus.ON_THE_WAY;

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Live Tracking" />

            <View className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                <ScrollView
                    className="flex-1"
                    style={{ backgroundColor: "#F3F4F6" }}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => fetchOrder(true)}
                            tintColor="#E95322"
                        />
                    }
                >
                    <View className="flex-1 items-center justify-center" style={{ minHeight: 300 }}>
                        <Feather name="map-pin" size={80} color="#E95322" />
                        <Text className="text-[#9CA3AF] font-semibold mt-4">Map integration coming soon</Text>
                        <Text className="text-[#6B7280] text-sm mt-2">Track your delivery in real-time</Text>
                    </View>

                    <View className="absolute top-4 right-4">
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleCallDriver}
                            className="w-12 h-12 rounded-full items-center justify-center mb-3 shadow-lg"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Feather name="phone" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleMessageDriver}
                            className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
                            style={{ backgroundColor: "#E95322" }}
                        >
                            <Feather name="message-circle" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View className="px-6 pb-6 mt-8">
                        <View className="rounded-3xl px-6 py-5" style={{ backgroundColor: "#FFFFFF", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}>
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-1">
                                    <Text className="font-bold text-[#070707] text-lg">
                                        {order.restaurant_name || 'Your Order'}
                                    </Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">
                                        Order #{order.order_number}
                                    </Text>
                                </View>
                                <Text className="text-[#6B7280] text-xs">
                                    {formatDate(order.created_at)}
                                </Text>
                            </View>

                            <View className="bg-[#FFF5D6] rounded-xl px-4 py-3 mb-4">
                                <Text className="text-[#E95322] font-semibold text-sm">
                                    {getStatusMessage(order.status)}
                                </Text>
                            </View>

                            <View
                                className="mt-2 rounded-full overflow-hidden"
                                style={{ backgroundColor: "#E5E7EB", height: 12 }}
                            >
                                <View
                                    style={{
                                        width: `${progress}%`,
                                        height: 12,
                                        backgroundColor: "#E95322",
                                        borderRadius: 999
                                    }}
                                />
                            </View>

                            <View className="flex-row items-center justify-between mt-4">
                                <View className="items-start flex-1">
                                    <Text className="text-[#E95322] font-bold text-xs">Order Placed</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">
                                        {formatTime(order.created_at)}
                                    </Text>
                                </View>
                                {order.estimated_delivery && (
                                    <View className="items-end flex-1">
                                        <Text className="text-[#E95322] font-bold text-xs">Estimated Delivery</Text>
                                        <Text className="text-[#6B7280] text-xs mt-1">
                                            {formatTime(order.estimated_delivery)}
                                        </Text>
                                    </View>
                                )}
                            </View>

                            <View className="mt-6 gap-3">
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => router.push(`/orders/${order.id}`)}
                                    className="px-6 py-3 rounded-full border-2"
                                    style={{ borderColor: "#E95322" }}
                                >
                                    <Text className="text-[#E95322] font-semibold text-center">View Order Details</Text>
                                </TouchableOpacity>

                                {canMarkDelivered && (
                                    <TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={handleMarkDelivered}
                                        className="px-6 py-3 rounded-full"
                                        style={{ backgroundColor: "#E95322" }}
                                    >
                                        <Text className="text-white font-semibold text-center">Mark as Delivered</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
