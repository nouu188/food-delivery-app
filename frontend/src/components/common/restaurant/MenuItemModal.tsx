import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Plus, Minus, ShoppingCart } from "lucide-react-native";
import { MenuItem, MenuItemOption } from "@/types/api/restaurant";
import { formatPrice } from "@/utils/format";
import { useToastStore } from "@/store/useToastStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface MenuItemModalProps {
    visible: boolean;
    item: MenuItem | null;
    onClose: () => void;
    onAddToCart: (
        item: MenuItem,
        quantity: number,
        selectedOptions: Array<{
            option_group: string;
            name: string;
            price_modifier: number;
        }>,
        specialInstructions?: string
    ) => void;
    isAdding?: boolean;
}

interface GroupedOptions {
    [groupName: string]: MenuItemOption[];
}

export default function MenuItemModal({ visible, item, onClose, onAddToCart, isAdding = false }: MenuItemModalProps) {
    const showToast = useToastStore((s) => s.show);
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<{
        [groupName: string]: Set<string>;
    }>({});
    const [specialInstructions, setSpecialInstructions] = useState("");

    const groupedOptions: GroupedOptions = {};
    if (item?.options) {
        item.options.forEach((option) => {
            if (!groupedOptions[option.option_group]) {
                groupedOptions[option.option_group] = [];
            }
            groupedOptions[option.option_group].push(option);
        });
    }

    useEffect(() => {
        if (item) {
            setQuantity(1);
            setSpecialInstructions("");

            const defaults: { [groupName: string]: Set<string> } = {};
            Object.entries(groupedOptions).forEach(([groupName, options]) => {
                const defaultOptions = options.filter((opt) => opt.is_default);
                if (defaultOptions.length > 0) {
                    defaults[groupName] = new Set(defaultOptions.map((opt) => opt.name));
                } else {
                    defaults[groupName] = new Set();
                }
            });
            setSelectedOptions(defaults);
        }
    }, [item]);

    if (!item) return null;

    const toggleOption = (groupName: string, optionName: string) => {
        const groupOptions = groupedOptions[groupName];
        const maxSelections = groupOptions[0]?.max_selections || 1;

        setSelectedOptions((prev) => {
            const newSelections = { ...prev };
            if (!newSelections[groupName]) {
                newSelections[groupName] = new Set();
            }

            if (maxSelections === 1) {
                if (newSelections[groupName].has(optionName)) {
                    newSelections[groupName] = new Set();
                } else {
                    newSelections[groupName] = new Set([optionName]);
                }
            } else {
                if (newSelections[groupName].has(optionName)) {
                    newSelections[groupName].delete(optionName);
                } else if (newSelections[groupName].size < maxSelections) {
                    newSelections[groupName].add(optionName);
                }
            }

            return newSelections;
        });
    };

    const calculateTotalPrice = () => {
        let basePrice = Number(item.price);
        let optionsPrice = 0;

        Object.entries(selectedOptions).forEach(([groupName, optionNames]) => {
            const groupOpts = groupedOptions[groupName] || [];
            optionNames.forEach((optName) => {
                const option = groupOpts.find((opt) => opt.name === optName);
                if (option) {
                    optionsPrice += Number(option.price_modifier || 0);
                }
            });
        });

        return (basePrice + optionsPrice) * quantity;
    };

    const handleAddToCart = () => {
        for (const [groupName, options] of Object.entries(groupedOptions)) {
            const isRequired = options.some((opt) => opt.is_required);
            if (isRequired && (!selectedOptions[groupName] || selectedOptions[groupName].size === 0)) {
                showToast({ type: "error", title: "Required", message: `Please select ${groupName}` });
                return;
            }
        }

        const formattedOptions: Array<{
            option_group: string;
            name: string;
            price_modifier: number;
        }> = [];

        Object.entries(selectedOptions).forEach(([groupName, optionNames]) => {
            const groupOpts = groupedOptions[groupName] || [];
            optionNames.forEach((optName) => {
                const option = groupOpts.find((opt) => opt.name === optName);
                if (option) {
                    formattedOptions.push({
                        option_group: groupName,
                        name: optName,
                        price_modifier: Number(option.price_modifier || 0),
                    });
                }
            });
        });

        onAddToCart(item, quantity, formattedOptions, specialInstructions.trim() || undefined);
    };

    const isOptionSelected = (groupName: string, optionName: string) => {
        return selectedOptions[groupName]?.has(optionName) || false;
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <TouchableOpacity activeOpacity={1} style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
                    <SafeAreaView style={styles.safeArea}>
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Customize Your Order</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <X size={24} color="#070707" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            style={styles.scrollView}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <View style={styles.itemInfoContainer}>
                                {item.image_url ? (
                                    <Image
                                        source={{ uri: item.image_url }}
                                        style={styles.itemImage}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={[styles.itemImage, styles.noImage]}>
                                        <Text style={styles.noImageText}>No Image</Text>
                                    </View>
                                )}

                                <View style={styles.itemTextInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    {item.description && (
                                        <Text style={styles.itemDescription} numberOfLines={2}>
                                            {item.description}
                                        </Text>
                                    )}
                                    <Text style={styles.basePrice}>Base: ${formatPrice(item.price)}</Text>
                                </View>
                            </View>

                            {Object.keys(groupedOptions).length > 0 && (
                                <View style={styles.optionsContainer}>
                                    {Object.entries(groupedOptions).map(([groupName, options]) => {
                                        const maxSelections = options[0]?.max_selections || 1;
                                        const isRequired = options.some((opt) => opt.is_required);

                                        return (
                                            <View key={groupName} style={styles.optionGroup}>
                                                <View style={styles.optionGroupHeader}>
                                                    <Text style={styles.optionGroupTitle}>
                                                        {groupName}
                                                        {isRequired && <Text style={styles.required}> *</Text>}
                                                    </Text>
                                                    <Text style={styles.optionGroupSubtitle}>
                                                        {maxSelections === 1
                                                            ? "Select one"
                                                            : `Select up to ${maxSelections}`}
                                                    </Text>
                                                </View>

                                                {options.map((option) => {
                                                    const isSelected = isOptionSelected(groupName, option.name);
                                                    const priceModifier = Number(option.price_modifier || 0);

                                                    return (
                                                        <TouchableOpacity
                                                            key={option.id}
                                                            style={[
                                                                styles.optionItem,
                                                                isSelected && styles.optionItemSelected,
                                                            ]}
                                                            onPress={() => toggleOption(groupName, option.name)}
                                                            activeOpacity={0.7}
                                                        >
                                                            <View style={styles.optionLeft}>
                                                                <View
                                                                    style={[
                                                                        maxSelections === 1
                                                                            ? styles.radio
                                                                            : styles.checkbox,
                                                                        isSelected &&
                                                                            (maxSelections === 1
                                                                                ? styles.radioSelected
                                                                                : styles.checkboxSelected),
                                                                    ]}
                                                                >
                                                                    {isSelected && maxSelections > 1 && (
                                                                        <View style={styles.checkmark} />
                                                                    )}
                                                                    {isSelected && maxSelections === 1 && (
                                                                        <View style={styles.radioDot} />
                                                                    )}
                                                                </View>
                                                                <Text
                                                                    style={[
                                                                        styles.optionName,
                                                                        isSelected && styles.optionNameSelected,
                                                                    ]}
                                                                >
                                                                    {option.name}
                                                                </Text>
                                                            </View>
                                                            {priceModifier !== 0 && (
                                                                <Text style={styles.optionPrice}>
                                                                    {priceModifier > 0 ? "+" : ""}$
                                                                    {formatPrice(Math.abs(priceModifier))}
                                                                </Text>
                                                            )}
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}

                            <View style={styles.quantityContainer}>
                                <Text style={styles.quantityLabel}>Quantity</Text>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                                        style={styles.quantityButton}
                                        activeOpacity={0.7}
                                    >
                                        <Minus size={20} color="#E95322" />
                                    </TouchableOpacity>

                                    <Text style={styles.quantityValue}>{quantity}</Text>

                                    <TouchableOpacity
                                        onPress={() => setQuantity(quantity + 1)}
                                        style={[styles.quantityButton, styles.quantityButtonPlus]}
                                        activeOpacity={0.7}
                                    >
                                        <Plus size={20} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.footer}>
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalPrice}>${formatPrice(calculateTotalPrice())}</Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.addButton, isAdding && styles.addButtonDisabled]}
                                onPress={handleAddToCart}
                                disabled={isAdding}
                                activeOpacity={0.9}
                            >
                                {isAdding ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <ShoppingCart size={20} color="#FFFFFF" />
                                        <Text style={styles.addButtonText}>
                                            Add to Cart • ${formatPrice(calculateTotalPrice())}
                                        </Text>
                                    </>
                                )}
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
        paddingBottom: 24,
    },
    itemInfoContainer: {
        flexDirection: "row",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
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
    },
    itemName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#070707",
        marginBottom: 6,
    },
    itemDescription: {
        fontSize: 14,
        color: "#6B7280",
        marginBottom: 8,
        lineHeight: 20,
    },
    basePrice: {
        fontSize: 14,
        color: "#E95322",
        fontWeight: "600",
    },
    optionsContainer: {
        paddingTop: 8,
    },
    optionGroup: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    optionGroupHeader: {
        marginBottom: 12,
    },
    optionGroupTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#070707",
        marginBottom: 4,
    },
    required: {
        color: "#EF4444",
    },
    optionGroupSubtitle: {
        fontSize: 13,
        color: "#6B7280",
    },
    optionItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
        backgroundColor: "#F9FAFB",
    },
    optionItemSelected: {
        backgroundColor: "#FFF5E6",
        borderWidth: 2,
        borderColor: "#E95322",
    },
    optionLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        backgroundColor: "#E95322",
        borderColor: "#E95322",
    },
    checkmark: {
        width: 10,
        height: 10,
        borderRadius: 2,
        backgroundColor: "#FFFFFF",
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    radioSelected: {
        borderColor: "#E95322",
    },
    radioDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#E95322",
    },
    optionName: {
        fontSize: 15,
        color: "#374151",
        flex: 1,
    },
    optionNameSelected: {
        fontWeight: "600",
        color: "#070707",
    },
    optionPrice: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E95322",
        marginLeft: 8,
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    quantityLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#070707",
    },
    quantityControls: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF5E6",
        borderRadius: 999,
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    quantityButtonPlus: {
        backgroundColor: "#E95322",
    },
    quantityValue: {
        fontSize: 16,
        fontWeight: "700",
        color: "#070707",
        marginHorizontal: 20,
        minWidth: 30,
        textAlign: "center",
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: "#F3F4F6",
    },
    totalContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6B7280",
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: "800",
        color: "#E95322",
    },
    addButton: {
        backgroundColor: "#E95322",
        borderRadius: 999,
        paddingVertical: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    addButtonDisabled: {
        opacity: 0.6,
    },
    addButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});
