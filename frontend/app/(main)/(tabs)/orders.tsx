import Header from "@/components/common/Header";
import EmptyState from "@/components/common/orders/EmptyState";
import OrderItem from "@/components/common/orders/OrderItem";
import OrderTabHeader from "@/components/common/orders/OrderTabHeader";
import orderService from "@/services/api/order.service";
import restaurantService from "@/services/api/restaurant.service";
import { Order, OrderStatus } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyOrders() {
    const [activeTab, setActiveTab] = useState<"Active" | "Completed" | "Cancelled">("Active");
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]);
    const [restaurantImages, setRestaurantImages] = useState<Record<string, string | null>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const orderCounts = useMemo(() => {
        const activeStatuses = [
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.PICKED_UP,
            OrderStatus.ON_THE_WAY,
        ];
        const completedStatuses = [OrderStatus.DELIVERED, OrderStatus.COMPLETED];
        const cancelledStatuses = [OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.FAILED];

        return {
            active: allOrders.filter(o => activeStatuses.includes(o.status)).length,
            completed: allOrders.filter(o => completedStatuses.includes(o.status)).length,
            cancelled: allOrders.filter(o => cancelledStatuses.includes(o.status)).length,
        };
    }, [allOrders]);

    const statistics = useMemo(() => {
        const completedOrders = allOrders.filter(o =>
            [OrderStatus.DELIVERED, OrderStatus.COMPLETED].includes(o.status)
        );

        const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
        const totalOrders = allOrders.length;
        const averageOrder = totalOrders > 0 ? totalSpent / completedOrders.length : 0;

        return {
            totalSpent: totalSpent.toFixed(2),
            totalOrders,
            averageOrder: averageOrder.toFixed(2),
            activeOrders: orderCounts.active,
        };
    }, [allOrders, orderCounts]);

    const hydrateRestaurantImages = useCallback(
        async (ordersToHydrate: Order[]) => {
            const ids = Array.from(
                new Set(
                    (ordersToHydrate || [])
                        .map((o) => o?.restaurant_id)
                        .filter((id): id is string => typeof id === "string" && id.length > 0)
                )
            );

            const missing = ids.filter((id) => restaurantImages[id] === undefined);
            if (missing.length === 0) return;

            const results = await Promise.all(
                missing.map(async (restaurantId) => {
                    const restaurant = await restaurantService.getRestaurantById(restaurantId).catch(() => null);
                    const imageUrl = restaurant?.logo_url || restaurant?.cover_image_url || null;
                    return [restaurantId, imageUrl] as const;
                })
            );

            setRestaurantImages((prev) => {
                const next = { ...prev };
                for (const [id, url] of results) {
                    next[id] = url;
                }
                return next;
            });
        },
        [restaurantImages]
    );

    const fetchOrders = useCallback(
        async (showRefreshIndicator = false) => {
            try {
                if (showRefreshIndicator) {
                    setIsRefreshing(true);
                } else {
                    setIsLoading(true);
                }

                let statuses: OrderStatus[] = [];
                if (activeTab === "Active") {
                    statuses = [
                        OrderStatus.PENDING,
                        OrderStatus.CONFIRMED,
                        OrderStatus.PREPARING,
                        OrderStatus.READY_FOR_PICKUP,
                        OrderStatus.PICKED_UP,
                        OrderStatus.ON_THE_WAY,
                    ];
                } else if (activeTab === "Completed") {
                    statuses = [OrderStatus.DELIVERED, OrderStatus.COMPLETED];
                } else {
                    statuses = [OrderStatus.CANCELLED, OrderStatus.REFUNDED, OrderStatus.FAILED];
                }

                const response = await orderService.getOrders({
                    page: 1,
                    limit: 50,
                });

                const orderData = response?.data || [];
                setAllOrders(Array.isArray(orderData) ? orderData : []);

                const filteredOrders = Array.isArray(orderData)
                    ? orderData.filter((order) => statuses.includes(order.status))
                    : [];

                setOrders(filteredOrders);
                await hydrateRestaurantImages(filteredOrders);
            } catch (error) {
                showErrorAlert(error, "Failed to Load Orders");
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [activeTab, hydrateRestaurantImages]
    );

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const time = date.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
        return `${day} ${month}, ${time}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header
                title="My Orders"
                showBackButton={false}
            />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <OrderTabHeader
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    counts={orderCounts}
                />

                {isLoading ? (
                    <View className="flex-1 items-center justify-center pt-20">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-[#6B7280] mt-4">Loading orders...</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchOrders(true)}
                                tintColor="#E95322"
                            />
                        }
                    >
                        <View className="pb-32">
                            {orders.length === 0 ? (
                                <View className="items-center pt-12">
                                    <EmptyState
                                        message={activeTab === "Active"
                                            ? "You don't have any\nactive orders at this time"
                                            : activeTab === "Completed"
                                            ? "You don't have any\ncompleted orders yet"
                                            : "You don't have any\ncancelled orders"
                                        }
                                    />
                                    {activeTab === "Active" && (
                                        <TouchableOpacity
                                            onPress={() => router.push("/(main)/(tabs)/Home")}
                                            className="mt-8 px-8 py-4 rounded-full bg-[#E95322]"
                                            activeOpacity={0.9}
                                        >
                                            <Text className="text-white font-semibold text-base">Start Ordering</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                orders.map((order) => {
                                    const displayName =
                                        order.restaurant_name || order.items?.[0]?.menu_item?.name || "Order";
                                    const itemCount = order.items?.length || 0;

                                    return (
                                        <OrderItem
                                            key={order.id}
                                            id={order.id}
                                            name={displayName}
                                            price={`$${order.total_amount}`}
                                            date={formatDate(order.created_at)}
                                            itemsCount={itemCount}
                                            image={
                                                order.items?.[0]?.menu_item?.image_url
                                                    ? { uri: order.items[0].menu_item.image_url }
                                                    : restaurantImages[order.restaurant_id]
                                                    ? { uri: restaurantImages[order.restaurant_id] as string }
                                                    : undefined
                                            }
                                            status={activeTab}
                                            restaurantId={order.restaurant_id}
                                            hasReview={false}
                                            orderStatus={order.status}
                                        />
                                    );
                                })
                            )}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
