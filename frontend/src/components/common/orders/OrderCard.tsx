import { Order, OrderStatus } from "@/types/api/order";
import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OrderCardProps {
    order: Order;
    onCancel: (orderId: string) => void;
    onReview: (orderId: string) => void;
    onReorder: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onCancel, onReview, onReorder }) => {
    const firstItem = order.items?.[0];
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' });
    };

    return (
        <View style={styles.card}>
            {firstItem?.menu_item?.image_url ? (
                <Image source={{ uri: firstItem.menu_item.image_url }} style={styles.image} />
            ) : (
                <View style={[styles.image, { backgroundColor: '#e0e0e0' }]} />
            )}

            <View style={styles.detailsContainer}>
                <View style={styles.row}>
                    <Text style={styles.name}>{order.restaurant_name || 'Restaurant'}</Text>
                    <Text style={styles.price}>${order.total_amount.toFixed(2)}</Text>
                </View>

                <View style={[styles.row, { marginTop: 4 }]}>
                    <Text style={styles.date}>{formatDate(order.created_at)}</Text>
                    <Text style={styles.items}>{order.items.length} items</Text>
                </View>

                {order.status === OrderStatus.COMPLETED && (
                    <>
                        <Text style={styles.deliveredText}>✓ Order delivered</Text>
                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.reviewButton} onPress={() => onReview(order.id)}>
                                <Text style={styles.reviewButtonText}>Leave a review</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.reorderButton} onPress={() => onReorder(order.id)}>
                                <Text style={styles.reorderButtonText}>Order Again</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {(order.status === OrderStatus.PENDING || order.status === OrderStatus.CONFIRMED || order.status === OrderStatus.PREPARING || order.status === OrderStatus.READY_FOR_PICKUP || order.status === OrderStatus.PICKED_UP || order.status === OrderStatus.ON_THE_WAY) && (
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => onCancel(order.id)}>
                            <Text style={styles.cancelButtonText}>Cancel Order</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.trackButton}>
                            <Text style={styles.trackButtonText}>Track Driver</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {order.status === OrderStatus.CANCELLED && (
                    <View style={styles.statusRow}>
                        <AntDesign name="close-circle" size={14} color="#E5634D" style={{ marginRight: 4 }} />
                        <Text style={styles.cancelledText}>Order cancelled</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 12,
        marginBottom: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#FFD8C7",
    },
    image: {
        width: 71,
        height: 108,
        borderRadius: 15,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    price: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#E5634D",
    },
    date: {
        fontSize: 14,
        color: "#888",
    },
    items: {
        fontSize: 13,
        color: "#888",
    },
    deliveredText: {
        fontSize: 13,
        color: "#E5634D",
        marginTop: 2,
    },
    cancelledText: {
        fontSize: 13,
        color: "#E5634D",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 2,
    },
    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 6,
    },
    // Active state
    cancelButton: {
        backgroundColor: "#E5634D",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 10,
    },
    cancelButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    trackButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#E5634D",
    },
    trackButtonText: {
        color: "#E5634D",
        fontWeight: "600",
        fontSize: 13,
    },
    // Completed state
    reviewButton: {
        backgroundColor: "#E5634D",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginRight: 10,
    },
    reviewButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    reorderButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: "#E5634D",
    },
    reorderButtonText: {
        color: "#E5634D",
        fontWeight: "600",
        fontSize: 13,
    },
});

export default OrderCard;
