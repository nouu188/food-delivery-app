import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddressStore } from "@/store/useAddressStore";
import { useCartStore } from "@/store/useCartStore";
import { showErrorAlert } from "@/utils/error-handler";

export default function ConfirmOrderScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId, selectedAddress, fetchAddresses } = useAddressStore();
    const { cart, isLoading: isCartLoading, fetchCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([
                fetchCart(),
                fetchAddresses(),
            ]);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Data');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            Alert.alert('No Address Selected', 'Please select or add a delivery address before placing your order', [
                { text: 'Add Address', onPress: () => router.push('/delivery-address/add') },
                { text: 'Cancel', style: 'cancel' },
            ]);
            return;
        }

        if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
            Alert.alert('Empty Cart', 'Your cart is empty. Add items to cart before placing an order.');
            return;
        }

        router.push('/checkout/payment');
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Confirm Order" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading order details...</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                        <View className="flex-row items-center justify-between">
                            <Text className="text-[#070707] font-bold">Shipping Address</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/delivery-address")}>
                                <Text className="text-[#E95322] font-semibold text-xs">Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                            {selectedAddress ? (
                                <>
                                    <Text className="text-[#070707] font-semibold">{selectedAddress.label}</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">
                                        {selectedAddress.address_line}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                                    </Text>
                                </>
                            ) : (
                                <Text className="text-[#9CA3AF] text-sm">No address selected</Text>
                            )}
                        </View>

                        <Text className="mt-8 text-[#070707] font-bold">Order Summary</Text>
                        <View className="mt-4">
                            {cart?.items && Array.isArray(cart.items) && cart.items.map((item) => (
                                <View
                                    key={item.id}
                                    className="flex-row items-center py-4 border-b"
                                    style={{ borderBottomColor: "#FFD8C7" }}
                                >
                                    <View
                                        className="w-16 h-16 rounded-2xl overflow-hidden"
                                        style={{ backgroundColor: "#FFE3D6" }}
                                    >
                                        {item.menu_item?.image_url ? (
                                            <Image source={{ uri: item.menu_item.image_url }} className="w-full h-full" />
                                        ) : (
                                            <View className="w-full h-full items-center justify-center">
                                                <Text className="text-gray-400 text-xs">No Image</Text>
                                            </View>
                                        )}
                                    </View>
                                    <View className="flex-1 ml-4">
                                        <Text className="font-semibold text-[#070707]" numberOfLines={1}>
                                            {item.menu_item?.name || item.item_name}
                                        </Text>
                                        <Text className="text-[#6B7280] text-xs mt-1">{item.quantity} items</Text>
                                    </View>
                                    <Text className="font-bold text-[#E95322]">${item.total_price.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>

                        <View className="mt-8">
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-[#6B7280]">Subtotal</Text>
                                <Text className="font-semibold text-[#070707]">${cart?.subtotal.toFixed(2) || '0.00'}</Text>
                            </View>
                            {cart && cart.tax_amount > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Tax and Fees</Text>
                                    <Text className="font-semibold text-[#070707]">${cart.tax_amount.toFixed(2)}</Text>
                                </View>
                            )}
                            {cart && cart.delivery_fee > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Delivery</Text>
                                    <Text className="font-semibold text-[#070707]">${cart.delivery_fee.toFixed(2)}</Text>
                                </View>
                            )}
                            {cart && cart.discount_amount > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Discount</Text>
                                    <Text className="font-semibold text-green-600">-${cart.discount_amount.toFixed(2)}</Text>
                                </View>
                            )}
                            <View className="flex-row justify-between border-t pt-5" style={{ borderTopColor: "#FFD8C7" }}>
                                <Text className="text-lg font-extrabold text-[#070707]">Total</Text>
                                <Text className="text-lg font-extrabold text-[#E95322]">${cart?.total.toFixed(2) || '0.00'}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handlePlaceOrder}
                            disabled={!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0 || !selectedAddress}
                            className="self-center mt-10 px-16 py-4 rounded-full"
                            style={{ backgroundColor: (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0 || !selectedAddress) ? "#9CA3AF" : "#E95322" }}
                        >
                            <Text className="text-white font-semibold">Continue to Payment</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
