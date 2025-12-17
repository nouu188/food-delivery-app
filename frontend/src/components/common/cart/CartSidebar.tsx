import React, { useCallback, useEffect, useRef } from "react";
import {
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

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.86;

export default function CartSidebar() {
    const router = useRouter();
    const { items, isDrawerOpen, closeDrawer, increment, decrement, removeItem, subtotal } = useCartStore();

    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

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

    const total = subtotal();

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
                        renderItem={({ item }) => (
                            <View style={styles.itemRow}>
                                <View style={styles.thumb}>
                                    {item.image ? (
                                        <Image source={item.image} style={styles.thumbImg} />
                                    ) : item.imageUri ? (
                                        <Image source={{ uri: item.imageUri }} style={styles.thumbImg} />
                                    ) : (
                                        <View style={[styles.thumbImg, { backgroundColor: "#FFE3D6" }]} />
                                    )}
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={1} style={styles.itemTitle}>
                                        {item.title}
                                    </Text>
                                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

                                    <View style={styles.qtyRow}>
                                        <TouchableOpacity
                                            onPress={() => decrement(item.id)}
                                            activeOpacity={0.8}
                                            style={styles.qtyBtn}
                                        >
                                            <Feather name="minus" size={16} color="#E5634D" />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyText}>{item.qty}</Text>
                                        <TouchableOpacity
                                            onPress={() => increment(item.id)}
                                            activeOpacity={0.8}
                                            style={[styles.qtyBtn, { backgroundColor: "#E5634D" }]}
                                        >
                                            <Feather name="plus" size={16} color="#FFFFFF" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => removeItem(item.id)}
                                            activeOpacity={0.8}
                                            style={styles.removeBtn}
                                        >
                                            <Feather name="trash-2" size={16} color="#E5634D" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        ListEmptyComponent={
                            <View style={{ paddingVertical: 24 }}>
                                <Text style={styles.emptyText}>Your cart is empty.</Text>
                            </View>
                        }
                    />

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
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
});
