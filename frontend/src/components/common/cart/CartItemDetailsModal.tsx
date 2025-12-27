import React from "react";
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X } from "lucide-react-native";
import { CartItem } from "@/types/api/order";
import { formatPrice } from "@/utils/format";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CartItemDetailsModalProps {
    visible: boolean;
    item: CartItem | null;
    onClose: () => void;
}

export default function CartItemDetailsModal({
    visible,
    item,
    onClose,
}: CartItemDetailsModalProps) {
    if (!item) return null;

    const hasOptions = item.selected_options && Array.isArray(item.selected_options) && item.selected_options.length > 0;
    const hasInstructions = item.special_instructions && item.special_instructions.trim().length > 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalContainer}
                    onPress={(e) => e.stopPropagation()}
                >
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Order Details</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color="#070707" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Item Info */}
                            <View style={styles.itemInfoContainer}>
                                {item.menu_item?.image_url ? (
                                    <Image
                                        source={{ uri: item.menu_item.image_url }}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.itemImage, styles.noImage]}>
                                        <Text style={styles.noImageText}>No Image</Text>
                                    </View>
                                )}

                                <View style={styles.itemTextInfo}>
                                    <Text style={styles.itemName}>
                                        {item.menu_item?.name || item.item_name}
                                    </Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.unitPriceLabel}>Unit Price: </Text>
                                        <Text style={styles.unitPrice}>${formatPrice(item.unit_price)}</Text>
                                    </View>
                                    <View style={styles.quantityRow}>
                                        <Text style={styles.quantityLabel}>Quantity: </Text>
                                        <Text style={styles.quantityValue}>{item.quantity}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Selected Options */}
                            {hasOptions && (
                                <View style={styles.optionsSection}>
                                    <Text style={styles.sectionTitle}>Selected Options</Text>
                                    {item.selected_options.map((option, index) => {
                                        const priceModifier = Number(option.price_modifier || 0);
                                        return (
                                            <View key={index} style={styles.optionItem}>
                                                <View style={styles.optionLeft}>
                                                    <Text style={styles.optionGroup}>
                                                        {option.option_group}:
                                                    </Text>
                                                    <Text style={styles.optionName}>
                                                        {option.name}
                                                    </Text>
                                                </View>
                                                {priceModifier !== 0 && (
                                                    <Text style={styles.optionPrice}>
                                                        {priceModifier > 0 ? '+' : ''}${formatPrice(Math.abs(priceModifier))}
                                                    </Text>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Special Instructions */}
                            {hasInstructions && (
                                <View style={styles.instructionsSection}>
                                    <Text style={styles.sectionTitle}>Special Instructions</Text>
                                    <View style={styles.instructionsBox}>
                                        <Text style={styles.instructionsText}>
                                            {item.special_instructions}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Price Breakdown */}
                            <View style={styles.priceSection}>
                                <Text style={styles.sectionTitle}>Price Breakdown</Text>

                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>Base Price</Text>
                                    <Text style={styles.priceValue}>
                                        ${formatPrice(item.unit_price)}
                                    </Text>
                                </View>

                                {hasOptions && item.selected_options.map((option, index) => {
                                    const priceModifier = Number(option.price_modifier || 0);
                                    if (priceModifier === 0) return null;
                                    return (
                                        <View key={index} style={styles.priceRow}>
                                            <Text style={styles.priceLabel}>
                                                • {option.name}
                                            </Text>
                                            <Text style={[styles.priceValue, priceModifier > 0 && styles.positivePrice]}>
                                                {priceModifier > 0 ? '+' : ''}${formatPrice(Math.abs(priceModifier))}
                                            </Text>
                                        </View>
                                    );
                                })}

                                <View style={styles.divider} />

                                <View style={styles.priceRow}>
                                    <Text style={styles.subtotalLabel}>
                                        Subtotal × {item.quantity}
                                    </Text>
                                    <Text style={styles.subtotalValue}>
                                        ${formatPrice(Number(item.total_price || 0))}
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={styles.closeFooterButton}
                                onPress={onClose}
                                activeOpacity={0.9}
                            >
                                <Text style={styles.closeFooterButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: SCREEN_HEIGHT * 0.85,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    safeArea: {
        flexShrink: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#070707",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    scrollView: {
        flexGrow: 0,
        flexShrink: 1,
    },
    scrollContent: {
        padding: 20,
    },
    itemInfoContainer: {
        flexDirection: "row",
        marginBottom: 20,
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 16,
        marginRight: 16,
    },
    noImage: {
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
    },
    noImageText: {
        color: "#9CA3AF",
        fontSize: 12,
    },
    itemTextInfo: {
        flex: 1,
        justifyContent: "center",
    },
    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#070707",
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    unitPriceLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    unitPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E95322",
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    quantityLabel: {
        fontSize: 14,
        color: "#6B7280",
    },
    quantityValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#070707",
    },
    optionsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#070707",
        marginBottom: 12,
    },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: "#FFF5E6",
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#FFE3D6",
    },
    optionLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    optionGroup: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6B7280",
        marginRight: 6,
    },
    optionName: {
        fontSize: 14,
        fontWeight: "600",
        color: "#070707",
    },
    optionPrice: {
        fontSize: 14,
        fontWeight: "700",
        color: "#E95322",
        marginLeft: 8,
    },
    instructionsSection: {
        marginBottom: 20,
    },
    instructionsBox: {
        backgroundColor: "#FFF5E6",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#FFE3D6",
    },
    instructionsText: {
        fontSize: 14,
        color: "#070707",
        lineHeight: 20,
    },
    priceSection: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 16,
    },
    priceLabel: {
        fontSize: 14,
        color: "#6B7280",
        flex: 1,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#070707",
    },
    positivePrice: {
        color: "#E95322",
    },
    divider: {
        height: 1,
        backgroundColor: "#E5E7EB",
        marginVertical: 12,
    },
    subtotalLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#070707",
        flex: 1,
    },
    subtotalValue: {
        fontSize: 18,
        fontWeight: "800",
        color: "#E95322",
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    closeFooterButton: {
        backgroundColor: "#E95322",
        borderRadius: 999,
        paddingVertical: 14,
        alignItems: "center",
    },
    closeFooterButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
