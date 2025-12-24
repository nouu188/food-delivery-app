// app/(tabs)/orders/history.tsx
import Header from "@/components/common/Header";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import orderService from "@/services/api/order.service";
import { Order, OrderStatus } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

export default function HistoryScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchOrders = async (pageNum = 1, showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else if (pageNum === 1) {
                setIsLoading(true);
            }

            const response = await orderService.getOrders({
                page: pageNum,
                limit: 20,
            });

            let historyOrders: Order[] = [];
            if (response?.items && Array.isArray(response.items)) {
                historyOrders = response.items.filter(order =>
                    [OrderStatus.DELIVERED, OrderStatus.COMPLETED, OrderStatus.CANCELLED, OrderStatus.REFUNDED].includes(order.status)
                );
            }

            if (pageNum === 1) {
                setOrders(historyOrders);
            } else {
                setOrders(prev => [...prev, ...historyOrders]);
            }

            setHasMore(response?.meta?.has_next_page ?? false);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Order History');
            if (pageNum === 1) {
                setOrders([]);
            }
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        return `${day} ${month}, ${time}`;
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.DELIVERED:
            case OrderStatus.COMPLETED:
                return { text: '✓ Order delivered', color: 'text-green-600' };
            case OrderStatus.CANCELLED:
                return { text: '✗ Order cancelled', color: 'text-red-600' };
            case OrderStatus.REFUNDED:
                return { text: '↺ Order refunded', color: 'text-blue-600' };
            default:
                return { text: status, color: 'text-gray-600' };
        }
    };

    const loadMore = () => {
        if (hasMore && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchOrders(nextPage);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="History" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                {isLoading && page === 1 ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading history...</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    setPage(1);
                                    fetchOrders(1, true);
                                }}
                                tintColor="#E95322"
                            />
                        }
                        onScroll={({ nativeEvent }) => {
                            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
                            if (isCloseToBottom) {
                                loadMore();
                            }
                        }}
                        scrollEventThrottle={400}
                    >
                        <View className="pb-32">
                            {orders.length === 0 ? (
                                <View className="items-center pt-20">
                                    <Text className="text-center text-gray-500 text-base">
                                        No order history yet
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => router.push('/(main)/(tabs)/Home')}
                                        className="mt-6 px-8 py-3 rounded-full bg-[#E95322]"
                                    >
                                        <Text className="text-white font-semibold">Start Ordering</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <>
                                    {orders.map((order) => {
                                        const statusInfo = getStatusText(order.status);
                                        return (
                                            <TouchableOpacity
                                                key={order.id}
                                                onPress={() => router.push(`/orders/${order.id}`)}
                                                className="bg-white rounded-2xl p-4 mb-4 shadow-sm flex-row justify-between items-center"
                                                style={{
                                                    shadowColor: "#000",
                                                    shadowOpacity: 0.05,
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowRadius: 4,
                                                    elevation: 2,
                                                }}
                                            >
                                                <View>
                                                    <Text className="font-medium">Order No. {order.id.substring(0, 8)}</Text>
                                                    <Text className="text-sm text-gray-500 mt-1">
                                                        {formatDate(order.created_at)}
                                                    </Text>
                                                    <Text className={`text-sm mt-1 ${statusInfo.color}`}>
                                                        {statusInfo.text}
                                                    </Text>
                                                </View>

                                                <View className="items-end">
                                                    <Text className="text-2xl font-bold text-red-600">
                                                        ${order.total_amount.toFixed(2)}
                                                    </Text>
                                                    <Text className="text-sm text-gray-500">
                                                        {order.items?.length || 0} items
                                                    </Text>
                                                    <View className="bg-orange-100 px-5 py-2 rounded-full mt-3">
                                                        <Text className="text-orange-600 text-sm font-medium">Details</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                    {hasMore && (
                                        <View className="items-center py-4">
                                            <ActivityIndicator size="small" color="#E95322" />
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
