import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
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
import { CartItem } from "@/types/api/order";
import CartItemDetailsModal from "./CartItemDetailsModal";
import VoucherInput from "../voucher/VoucherInput";
import { showErrorAlert } from "@/utils/error-handler";
import { useToastStore } from "@/store/useToastStore";
import { confirm } from "@/utils/confirm";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.86;

export default function CartSidebar() {
    const router = useRouter();
    const showToast = useToastStore((s) => s.show);
    const {
        cart,
        isDrawerOpen,
        closeDrawer,
        updateQuantity,
        removeItem,
        removeBulkItems,
        selectedItemIds,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
        selectedTotal,
        selectedCount,
        fetchCart,
        appliedVoucher,
        getDiscountedTotal,
    } = useCartStore();

    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Track loading states for individual items
    const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
    const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);

    // Details modal state
    const [selectedItemForDetails, setSelectedItemForDetails] = useState<CartItem | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const items = cart?.items || [];
    const totalAmount = selectedTotal();
    const selectedItemCount = selectedCount();
    const allSelected = items.length > 0 && items.every((item) => selectedItemIds.has(item.id));

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

        setLoadingItems((prev) => new Set(prev).add(itemId));
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error: any) {
            showErrorAlert(error, "Update Failed");
        } finally {
            setLoadingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        const ok = await confirm({
            title: "Remove Item",
            message: "Are you sure you want to remove this item from your cart?",
            confirmText: "Remove",
            cancelText: "Cancel",
            destructive: true,
        });

        if (!ok) return;

        setRemovingItems((prev) => new Set(prev).add(itemId));
        try {
            await removeItem(itemId);
        } catch (error: any) {
            showErrorAlert(error, "Remove Failed");
        } finally {
            setRemovingItems((prev) => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const handleBulkDelete = async () => {
        const selectedIds = Array.from(selectedItemIds);
        if (selectedIds.length === 0) {
            showToast({ type: "info", title: "Cart", message: "Please select items to delete." });
            return;
        }

        const ok = await confirm({
            title: "Delete Selected Items",
            message: `Are you sure you want to remove ${selectedIds.length} item${
                selectedIds.length > 1 ? "s" : ""
            } from your cart?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            destructive: true,
        });

        if (!ok) return;

        setIsBulkDeleting(true);
        try {
            await removeBulkItems(selectedIds);
            showToast({ type: "success", title: "Success", message: "Selected items removed from cart." });
        } catch (error: any) {
            showErrorAlert(error, "Delete Failed");
        } finally {
            setIsBulkDeleting(false);
        }
    };

    const handleToggleSelectAll = () => {
        if (allSelected) {
            deselectAllItems();
        } else {
            selectAllItems();
        }
    };

    const handleCheckout = () => {
        if (selectedItemIds.size === 0) {
            showToast({ type: "info", title: "Cart", message: "Please select items to checkout." });
            return;
        }
        closeSidebar();
        requestAnimationFrame(() => router.push("/checkout/confirm-order"));
    };

    const handleViewDetails = (item: CartItem) => {
        setSelectedItemForDetails(item);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedItemForDetails(null);
    };

    if (!isDrawerOpen) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 9999 }]} pointerEvents="auto">
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

                    {items.length > 0 && (
                        <View style={styles.selectionRow}>
                            <TouchableOpacity
                                onPress={handleToggleSelectAll}
                                activeOpacity={0.7}
                                style={styles.selectAllBtn}
                            >
                                <View style={[styles.checkbox, allSelected && styles.checkboxChecked]}>
                                    {allSelected && <Feather name="check" size={14} color="#FFFFFF" />}
                                </View>
                                <Text style={styles.selectAllText}>Select All</Text>
                            </TouchableOpacity>

                            {selectedItemIds.size > 0 && (
                                <TouchableOpacity
                                    onPress={handleBulkDelete}
                                    activeOpacity={0.8}
                                    style={styles.bulkDeleteBtn}
                                    disabled={isBulkDeleting}
                                >
                                    {isBulkDeleting ? (
                                        <ActivityIndicator size="small" color="#FFFFFF" />
                                    ) : (
                                        <>
                                            <Feather name="trash-2" size={16} color="#FFFFFF" />
                                            <Text style={styles.bulkDeleteText}>Delete ({selectedItemIds.size})</Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    <View style={styles.divider} />

                    <FlatList
                        data={items}
                        keyExtractor={(x) => x.id}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        renderItem={({ item }) => {
                            const isLoading = loadingItems.has(item.id);
                            const isRemoving = removingItems.has(item.id);
                            const isDisabled = isLoading || isRemoving;
                            const isSelected = selectedItemIds.has(item.id);

                            return (
                                <View style={[styles.itemRow, isRemoving && styles.itemRemoving]}>
                                    <TouchableOpacity
                                        onPress={() => toggleItemSelection(item.id)}
                                        activeOpacity={0.7}
                                        style={styles.checkboxWrapper}
                                        disabled={isDisabled}
                                    >
                                        <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                                            {isSelected && <Feather name="check" size={14} color="#FFFFFF" />}
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.thumb}
                                        onPress={() => handleViewDetails(item)}
                                        activeOpacity={0.8}
                                        disabled={isDisabled}
                                    >
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
                                        <View style={styles.viewDetailsOverlay}>
                                            <Feather name="eye" size={12} color="#FFFFFF" />
                                        </View>
                                    </TouchableOpacity>

                                    <View style={{ flex: 1 }}>
                                        <TouchableOpacity
                                            onPress={() => handleViewDetails(item)}
                                            activeOpacity={0.7}
                                            disabled={isDisabled}
                                        >
                                            <Text numberOfLines={1} style={styles.itemTitle}>
                                                {item.menu_item?.name || item.item_name}
                                            </Text>
                                        </TouchableOpacity>
                                        <Text style={styles.itemPrice}>${formatPrice(item.unit_price)}</Text>

                                        {item.selected_options &&
                                            Array.isArray(item.selected_options) &&
                                            item.selected_options.length > 0 && (
                                                <View style={styles.optionsSummary}>
                                                    <Feather
                                                        name="plus-circle"
                                                        size={10}
                                                        color="#E95322"
                                                        style={{ marginRight: 4 }}
                                                    />
                                                    <Text numberOfLines={1} style={styles.optionsSummaryText}>
                                                        {item.selected_options.map((opt) => opt.name).join(", ")}
                                                    </Text>
                                                </View>
                                            )}

                                        <View style={styles.qtyRow}>
                                            {isLoading ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#FFFFFF"
                                                    style={{ marginRight: 10 }}
                                                />
                                            ) : (
                                                <>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            handleUpdateQuantity(
                                                                item.id,
                                                                item.quantity,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        activeOpacity={0.8}
                                                        style={[styles.qtyBtn, isDisabled && styles.btnDisabled]}
                                                        disabled={isDisabled}
                                                    >
                                                        <Feather
                                                            name="minus"
                                                            size={16}
                                                            color={isDisabled ? "#CCC" : "#E5634D"}
                                                        />
                                                    </TouchableOpacity>
                                                    <Text style={styles.qtyText}>{item.quantity}</Text>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            handleUpdateQuantity(
                                                                item.id,
                                                                item.quantity,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        activeOpacity={0.8}
                                                        style={[
                                                            styles.qtyBtn,
                                                            { backgroundColor: isDisabled ? "#CCC" : "#E5634D" },
                                                        ]}
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
                                                    <Feather
                                                        name="trash-2"
                                                        size={16}
                                                        color={isDisabled ? "#CCC" : "#E5634D"}
                                                    />
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
                        {selectedItemIds.size > 0 && (
                            <View style={styles.selectedInfo}>
                                <Feather name="check-circle" size={16} color="#FFD34E" />
                                <Text style={styles.selectedInfoText}>
                                    {selectedItemIds.size} item{selectedItemIds.size > 1 ? "s" : ""} selected (
                                    {selectedItemCount} total qty)
                                </Text>
                            </View>
                        )}

                        {cart?.restaurant_id && items.length > 0 && <VoucherInput restaurantId={cart.restaurant_id} />}

                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Subtotal</Text>
                            <Text style={styles.totalValue}>${formatPrice(totalAmount)}</Text>
                        </View>

                        {appliedVoucher && (
                            <View style={styles.discountRow}>
                                <Text style={styles.discountLabel}>Discount</Text>
                                <Text style={styles.discountValue}>
                                    -${formatPrice(appliedVoucher.discount_amount)}
                                </Text>
                            </View>
                        )}

                        {appliedVoucher && (
                            <View style={[styles.totalRow, styles.finalTotalRow]}>
                                <Text style={styles.finalTotalLabel}>Final Total</Text>
                                <Text style={styles.finalTotalValue}>${formatPrice(getDiscountedTotal())}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleCheckout}
                            style={[styles.checkoutBtn, { opacity: selectedItemIds.size > 0 ? 1 : 0.5 }]}
                            disabled={selectedItemIds.size === 0}
                        >
                            <Text style={styles.checkoutText}>
                                {selectedItemIds.size === 0
                                    ? "Select Items to Checkout"
                                    : `Checkout (${selectedItemIds.size})`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>

            <CartItemDetailsModal
                visible={showDetailsModal}
                item={selectedItemForDetails}
                onClose={handleCloseDetails}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 1,
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
        zIndex: 2,
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
    discountRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.2)",
        borderStyle: "dashed",
    },
    discountLabel: { fontSize: 15, fontWeight: "700", color: "#FFFFFF", opacity: 0.9 },
    discountValue: { fontSize: 16, fontWeight: "800", color: "#10B981" },
    finalTotalRow: {
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: "#FFD34E",
    },
    finalTotalLabel: { fontSize: 17, fontWeight: "900", color: "#FFFFFF" },
    finalTotalValue: { fontSize: 20, fontWeight: "900", color: "#FFD34E" },
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
    selectionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    selectAllBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    selectAllText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    bulkDeleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "rgba(255,255,255,0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    bulkDeleteText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FFFFFF",
    },
    checkboxWrapper: {
        padding: 4,
        marginRight: 8,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    checkboxChecked: {
        backgroundColor: "#FFD34E",
        borderColor: "#FFD34E",
    },
    selectedInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "rgba(255,255,255,0.15)",
        borderRadius: 12,
        marginBottom: 8,
    },
    selectedInfoText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#FFFFFF",
        flex: 1,
    },
    viewDetailsOverlay: {
        position: "absolute",
        bottom: 4,
        right: 4,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        alignItems: "center",
        justifyContent: "center",
    },
    optionsSummary: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        backgroundColor: "rgba(255, 255, 255, 0.15)",
        borderRadius: 8,
        alignSelf: "flex-start",
        maxWidth: "100%",
    },
    optionsSummaryText: {
        fontSize: 11,
        color: "#FFD34E",
        fontWeight: "600",
        flex: 1,
    },
});
