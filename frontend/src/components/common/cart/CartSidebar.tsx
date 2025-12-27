import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/format";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.86;

export default function CartSidebar() {
    const router = useRouter();
    const { cart, isDrawerOpen, closeDrawer, updateQuantity, removeItem, total, fetchCart } = useCartStore();

    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Track loading states for individual items
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

    const items = cart?.items || [];
    const totalAmount = total();

    // Fetch cart when drawer opens
    useEffect(() => {
        if (isDrawerOpen) {
            fetchCart().catch(() => {
                // Silent fail - cart might not exist yet
            });
        }
    }, [isDrawerOpen, fetchCart]);

    const openSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const closeSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: SIDEBAR_WIDTH, duration: 280, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 0, duration: 280, useNativeDriver: true }),
        ]).start(({ finished }) => {
            if (finished) closeDrawer();
        });
    }, [closeDrawer, fadeAnim, slideAnim]);

    useEffect(() => {
        if (isDrawerOpen) openSidebar();
    }, [isDrawerOpen, openSidebar]);

    const handleUpdateQuantity = async (itemId: string, currentQuantity: number, newQuantity: number) => {
        if (newQuantity < 1) {
            // If quantity would be 0 or less, remove the item instead
            handleRemoveItem(itemId);
            return;
        }

        if (newQuantity === currentQuantity) return;

        setLoadingItems(prev => new Set(prev).add(itemId));
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error: any) {
            Alert.alert(
                "Update Failed",
                error.message || "Failed to update item quantity. Please try again.",
                [{ text: "OK" }]
            );
        } finally {
            setLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        setRemovingItems(prev => new Set(prev).add(itemId));
                        try {
                            await removeItem(itemId);
                        } catch (error: any) {
                            Alert.alert(
                                "Remove Failed",
                                error.message || "Failed to remove item. Please try again.",
                                [{ text: "OK" }]
                            );
                        } finally {
                            setRemovingItems(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(itemId);
                                return newSet;
                            });
                        }
                    },
                },
            ]
        );
    };

    if (!isDrawerOpen) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar} />
            </Animated.View>

            <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconBox}>
                                <Feather name="shopping-bag" size={22} color="#E5634D" />
                            </View>
                            <Text style={styles.headerTitle}>Cart</Text>
                        </View>
                        <TouchableOpacity onPress={closeSidebar} activeOpacity={0.8} style={styles.closeBtn}>
                            <Feather name="x" size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    <FlatList
                        data={items}
                        keyExtractor={(x) => x.id}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        renderItem={({ item }) => {
                            const isLoading = loadingItems.has(item.id);
                            const isRemoving = removingItems.has(item.id);
                            const isDisabled = isLoading || isRemoving;

                            return (
                                <View style={[styles.itemRow, isRemoving && styles.itemRemoving]}>
                                    <View style={styles.thumb}>
                                        {item.menu_item?.image_url ? (
                                            <Image source={{ uri: item.menu_item.image_url }} style={styles.thumbImg} />
                                        ) : (
                                            <View style={[styles.thumbImg, { backgroundColor: "#FFE3D6" }]} />
                                        )}
                                        {isRemoving && (
                                            <View style={styles.thumbOverlay}>
                                                <ActivityIndicator size="small" color="#E5634D" />
                                            </View>
                                        )}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={1} style={styles.itemTitle}>
                                            {item.menu_item?.name || item.item_name}
                                        </Text>
                                        <Text style={styles.itemPrice}>${formatPrice(item.unit_price)}</Text>

                                        <View style={styles.qtyRow}>
                                            {isLoading ? (
                                                <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 10 }} />
                                            ) : (
                                                <>
                                                    <TouchableOpacity
                                                        onPress={() => handleUpdateQuantity(item.id, item.quantity, item.quantity - 1)}
                                                        activeOpacity={0.8}
                                                        style={[styles.qtyBtn, isDisabled && styles.btnDisabled]}
                                                        disabled={isDisabled}
                                                    >
                                                        <Feather name="minus" size={16} color={isDisabled ? "#CCC" : "#E5634D"} />
                                                    </TouchableOpacity>
                                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                                    <TouchableOpacity
                                                        onPress={() => handleUpdateQuantity(item.id, item.quantity, item.quantity + 1)}
                                                        activeOpacity={0.8}
                                                        style={[styles.qtyBtn, { backgroundColor: isDisabled ? "#CCC" : "#E5634D" }]}
                                                        disabled={isDisabled}
                                                    >
                                                        <Feather name="plus" size={16} color="#FFFFFF" />
                                                    </TouchableOpacity>
                                                </>
                                            )}

                                            <TouchableOpacity
                                                onPress={() => handleRemoveItem(item.id)}
                                                activeOpacity={0.8}
                                                style={[styles.removeBtn, isDisabled && styles.btnDisabled]}
                                                disabled={isDisabled}
                                            >
                                                {isRemoving ? (
                                                    <ActivityIndicator size="small" color="#E5634D" />
                                                ) : (
                                                    <Feather name="trash-2" size={16} color={isDisabled ? "#CCC" : "#E5634D"} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <View style={{ paddingVertical: 24 }}>
                                <Text style={styles.emptyText}>Your cart is empty.</Text>
                            </View>
                        }
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${formatPrice(totalAmount)}</Text>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => {
                                closeSidebar();
                                requestAnimationFrame(() => router.push("/checkout/confirm-order"));
                            }}
                            style={[styles.checkoutBtn, { opacity: items.length ? 1 : 0.5 }]}
                            disabled={!items.length}
                        >
                            <Text style={styles.checkoutText}>Checkout</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    sidebarContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: "#E5634D",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        paddingHorizontal: 22,
        shadowColor: "#000",
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 10,
    },
    safeArea: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10,
        paddingBottom: 14,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    headerIconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: { fontSize: 24, fontWeight: "800", color: "#FFFFFF" },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.18)",
        alignItems: "center",
        justifyContent: "center",
    },
    divider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", width: "100%" },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.18)",
        gap: 14,
    },
    thumb: { width: 64, height: 64, borderRadius: 16, overflow: "hidden", backgroundColor: "#FFFFFF" },
    thumbImg: { width: "100%", height: "100%" },
    itemTitle: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
    itemPrice: { marginTop: 2, fontSize: 13, fontWeight: "700", color: "#FFD34E" },
    qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10, gap: 10 },
    qtyBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    qtyText: { minWidth: 22, textAlign: "center", fontWeight: "800", color: "#FFFFFF" },
    removeBtn: {
        marginLeft: "auto",
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.95)",
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: { textAlign: "center", color: "#FFFFFF", fontWeight: "700" },
    footer: { paddingTop: 12, paddingBottom: 10 },
    totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
    totalLabel: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
    totalValue: { fontSize: 18, fontWeight: "900", color: "#FFD34E" },
    checkoutBtn: {
        marginTop: 6,
        backgroundColor: "#FFFFFF",
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: "center",
    },
    checkoutText: { color: "#E5634D", fontWeight: "900", fontSize: 16 },
    btnDisabled: {
        opacity: 0.5,
    },
    itemRemoving: {
        opacity: 0.6,
    },
    thumbOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255,255,255,0.8)",
        alignItems: "center",
        justifyContent: "center",
    },
});
