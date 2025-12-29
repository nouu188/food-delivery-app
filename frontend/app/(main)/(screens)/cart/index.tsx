import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/useCartStore";
import { showErrorAlert } from "@/utils/error-handler";
import { CartItem } from "@/types/api/order";
import CartItemDetailsModal from "@/components/common/cart/CartItemDetailsModal";
import { Feather } from "@expo/vector-icons";
import { confirm } from "@/utils/confirm";

export default function CartScreen() {
    const router = useRouter();
    const { cart, isLoading, fetchCart, updateQuantity, removeItem, clearCart } = useCartStore();
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    // Details modal state
    const [selectedItemForDetails, setSelectedItemForDetails] = useState<CartItem | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            const ok = await confirm({
                title: "Remove Item",
                message: "Do you want to remove this item from cart?",
                confirmText: "Remove",
                cancelText: "Cancel",
                destructive: true,
            });

            if (!ok) return;

            setIsUpdating(itemId);
            try {
                await removeItem(itemId);
            } catch (error) {
                showErrorAlert(error, "Failed to Remove Item");
            } finally {
                setIsUpdating(null);
            }
            return;
        }

        setIsUpdating(itemId);
        try {
            await updateQuantity(itemId, newQuantity);
        } catch (error) {
            showErrorAlert(error, "Failed to Update Cart");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        const ok = await confirm({
            title: "Remove Item",
            message: "Are you sure you want to remove this item from cart?",
            confirmText: "Remove",
            cancelText: "Cancel",
            destructive: true,
        });

        if (!ok) return;

        setIsUpdating(itemId);
        try {
            await removeItem(itemId);
        } catch (error) {
            showErrorAlert(error, "Failed to Remove Item");
        } finally {
            setIsUpdating(null);
        }
    };

    const handleCheckout = () => {
        if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) return;
        router.push("/checkout/confirm-order");
    };

    const handleViewDetails = (item: CartItem) => {
        setSelectedItemForDetails(item);
        setShowDetailsModal(true);
    };

    const handleCloseDetails = () => {
        setShowDetailsModal(false);
        setSelectedItemForDetails(null);
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Cart" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading cart...</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 140 }}
                        refreshControl={<RefreshControl refreshing={false} onRefresh={fetchCart} tintColor="#E95322" />}
                    >
                        {cart && cart.items && Array.isArray(cart.items) && cart.items.length > 0 ? (
                            <>
                                {cart.items.map((item) => (
                                    <View
                                        key={item.id}
                                        className="flex-row items-center py-4 border-b"
                                        style={{ borderBottomColor: "#FFD8C7" }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleViewDetails(item)}
                                            activeOpacity={0.8}
                                            className="w-16 h-16 rounded-2xl overflow-hidden relative"
                                            style={{ backgroundColor: "#FFE3D6" }}
                                        >
                                            {item.menu_item?.image_url ? (
                                                <Image
                                                    source={{ uri: item.menu_item.image_url }}
                                                    className="w-full h-full"
                                                />
                                            ) : (
                                                <View className="w-full h-full items-center justify-center">
                                                    <Text className="text-gray-400 text-xs">No Image</Text>
                                                </View>
                                            )}
                                            <View
                                                className="absolute bottom-1 right-1 w-6 h-6 rounded-full items-center justify-center"
                                                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                                            >
                                                <Feather name="eye" size={12} color="#FFFFFF" />
                                            </View>
                                        </TouchableOpacity>

                                        <View className="flex-1 ml-4">
                                            <TouchableOpacity
                                                onPress={() => handleViewDetails(item)}
                                                activeOpacity={0.7}
                                            >
                                                <Text className="font-semibold text-[#070707]" numberOfLines={1}>
                                                    {item.menu_item?.name || item.item_name}
                                                </Text>
                                            </TouchableOpacity>
                                            <Text className="text-[#E95322] font-bold mt-1">${item.unit_price}</Text>

                                            {item.selected_options &&
                                                Array.isArray(item.selected_options) &&
                                                item.selected_options.length > 0 && (
                                                    <View
                                                        className="flex-row items-center mt-2 px-2 py-1 rounded-lg self-start"
                                                        style={{ backgroundColor: "#FFF5E6" }}
                                                    >
                                                        <Feather
                                                            name="plus-circle"
                                                            size={10}
                                                            color="#E95322"
                                                            style={{ marginRight: 4 }}
                                                        />
                                                        <Text
                                                            numberOfLines={1}
                                                            className="text-[10px] text-[#E95322] font-semibold flex-1"
                                                        >
                                                            {item.selected_options.map((opt) => opt.name).join(", ")}
                                                        </Text>
                                                    </View>
                                                )}

                                            <View className="flex-row items-center mt-3">
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={isUpdating === item.id}
                                                    className="w-8 h-8 rounded-full items-center justify-center"
                                                    style={{ backgroundColor: "#FFE3D6" }}
                                                >
                                                    <Text className="text-[#E95322] font-extrabold">-</Text>
                                                </TouchableOpacity>
                                                <Text className="mx-4 font-extrabold text-[#070707]">
                                                    {item.quantity}
                                                </Text>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={isUpdating === item.id}
                                                    className="w-8 h-8 rounded-full items-center justify-center"
                                                    style={{ backgroundColor: "#E95322" }}
                                                >
                                                    <Text className="text-white font-extrabold">+</Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    onPress={() => handleRemoveItem(item.id)}
                                                    disabled={isUpdating === item.id}
                                                    className="ml-auto px-4 py-2 rounded-full"
                                                    style={{ backgroundColor: "#FFE3D6" }}
                                                >
                                                    <Text className="text-[#E95322] font-semibold">Remove</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}

                                <View className="mt-8 flex-row items-center justify-between">
                                    <Text className="text-lg font-extrabold text-[#070707]">Subtotal</Text>
                                    <Text className="text-lg font-extrabold text-[#070707]">${cart.subtotal}</Text>
                                </View>

                                {cart.discount_amount > 0 && (
                                    <View className="mt-2 flex-row items-center justify-between">
                                        <Text className="text-sm text-green-600">Discount</Text>
                                        <Text className="text-sm text-green-600">-${cart.discount_amount}</Text>
                                    </View>
                                )}

                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={handleCheckout}
                                    className="self-center mt-10 px-16 py-3 rounded-full"
                                    style={{ backgroundColor: "#E95322" }}
                                >
                                    <Text className="text-white font-semibold">Checkout</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View className="flex-1 items-center justify-center py-20">
                                <Text className="text-center text-[#6B7280] text-lg">Your cart is empty</Text>
                                <TouchableOpacity
                                    onPress={() => router.push("/(main)/(tabs)/Home")}
                                    className="mt-6 px-8 py-3 rounded-full"
                                    style={{ backgroundColor: "#E95322" }}
                                >
                                    <Text className="text-white font-semibold">Start Shopping</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>

            <CartItemDetailsModal
                visible={showDetailsModal}
                item={selectedItemForDetails}
                onClose={handleCloseDetails}
            />
        </SafeAreaView>
    );
}
