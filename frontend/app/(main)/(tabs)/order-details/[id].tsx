import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";
import { OrderStatus } from "@/types/Order.type";
import { useOrderStore } from "@/store/useOrderStore";
import EmptyState from "@/components/common/order/EmptyState";
import OrderCard from "@/components/common/order/OrderCard";
import { SafeAreaView } from "react-native-safe-area-context";

const TABS: OrderStatus[] = ["active", "completed", "cancelled"];

const MyOrdersScreen = () => {
    const { orders, cancelOrder } = useOrderStore();
    const [activeTab, setActiveTab] = useState<OrderStatus>("active");

    const filteredOrders = useMemo(() => orders.filter((order) => order.status === activeTab), [orders, activeTab]);

    const handleCancel = useCallback(
        (orderId: string) => {
            cancelOrder(orderId);
        },
        [cancelOrder]
    );

    const handleReview = useCallback((orderId: string) => {
        // TODO: mở modal hoặc điều hướng đến màn hình Review
        console.log("Review order:", orderId);
    }, []);

    const handleReorder = useCallback((orderId: string) => {
        // TODO: gọi API reorder hoặc thêm lại vào giỏ hàng
        console.log("Reorder:", orderId);
    }, []);

    const renderTab = (tab: OrderStatus) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity>
                    <Feather name="chevron-left" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
            </View>

            <View style={styles.container}>
                <View style={styles.tabContainer}>{TABS.map(renderTab)}</View>

                {filteredOrders.length === 0 ? (
                    <EmptyState message={`You don't have any\n${activeTab} orders at this time`} />
                ) : (
                    <FlatList
                        data={filteredOrders}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <OrderCard
                                order={item}
                                onCancel={handleCancel}
                                onReview={handleReview}
                                onReorder={handleReorder}
                            />
                        )}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#FFD34E",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        paddingTop: 0,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginLeft: 16,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingTop: 20,
    },
    tabContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: "#FDEBE8",
    },
    activeTab: {
        backgroundColor: "#E5634D",
    },
    tabText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#E5634D",
    },
    activeTabText: {
        color: "#FFFFFF",
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});

export default MyOrdersScreen;
