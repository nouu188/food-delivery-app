import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ShoppingCart } from "lucide-react-native";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/format";

interface FloatingCartButtonProps {
    onPress: () => void;
}

export default function FloatingCartButton({ onPress }: FloatingCartButtonProps) {
    const { cart, itemCount } = useCartStore();
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const items = cart?.items || [];
    const totalItems = itemCount();

    useEffect(() => {
        if (totalItems > 0) {
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [totalItems]);

    if (!cart || items.length === 0) {
        return null;
    }

    const total = Number(cart.total || 0);

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                },
            ]}
        >
            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPress={onPress}
            >
                <View style={styles.iconContainer}>
                    <ShoppingCart size={24} color="#FFFFFF" />
                    {totalItems > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {totalItems > 99 ? '99+' : totalItems}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.itemsText}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                    </Text>
                    <Text style={styles.priceText}>${formatPrice(total)}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 24,
        right: 20,
        zIndex: 100,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 12,
    },
    button: {
        backgroundColor: "#E95322",
        borderRadius: 999,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 14,
        paddingRight: 20,
        paddingVertical: 12,
        gap: 12,
    },
    iconContainer: {
        position: "relative",
    },
    badge: {
        position: "absolute",
        top: -6,
        right: -8,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
        borderWidth: 2,
        borderColor: "#E95322",
    },
    badgeText: {
        color: "#E95322",
        fontSize: 11,
        fontWeight: "800",
    },
    textContainer: {
        alignItems: "flex-start",
    },
    itemsText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
        opacity: 0.9,
    },
    priceText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
    },
});
