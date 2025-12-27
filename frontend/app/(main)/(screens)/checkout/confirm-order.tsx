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
    const { addresses, selectedAddressId, fetchAddresses } = useAddressStore();
    const { cart, selectedItemIds, selectedTotal, isLoading: isCartLoading, fetchCart } = useCartStore();
    const [isLoading, setIsLoading] = useState(true);

    const selectedAddress = selectedAddressId
        ? addresses.find(a => a.id === selectedAddressId) || null
        : null;

    const selectedItems = cart?.items?.filter(item => selectedItemIds.has(item.id)) || [];

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

    const calculateTotal = () => {
        const subtotal = selectedTotal();
        const deliveryFee = Number(cart?.delivery_fee) || 0;
        const taxAmount = Number(cart?.tax_amount) || 0;
        const discountAmount = Number(cart?.discount_amount) || 0;
        return subtotal + deliveryFee + taxAmount - discountAmount;
    };

    const handlePlaceOrder = () => {
        if (!selectedAddress) {
            Alert.alert('No Address Selected', 'Please select or add a delivery address before placing your order', [
                { text: 'Add Address', onPress: () => router.push('/delivery-address/add') },
                { text: 'Cancel', style: 'cancel' },
            ]);
            return;
        }

        if (selectedItems.length === 0) {
            Alert.alert('No Items Selected', 'Please select items from your cart to checkout.', [
                { text: 'OK', onPress: () => router.back() }
            ]);
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
                        <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: selectedAddress ? "#FFF5D6" : "#FEE2E2" }}>
                            {selectedAddress ? (
                                <>
                                    <Text className="text-[#070707] font-semibold">{selectedAddress.label}</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">
                                        {selectedAddress.address_line}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.city}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-red-600 font-semibold text-sm">No delivery address selected</Text>
                                    <TouchableOpacity
                                        onPress={() => router.push('/delivery-address/add')}
                                        className="mt-2 self-start"
                                    >
                                        <Text className="text-[#E95322] font-semibold text-xs underline">Add Address Now</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        <View className="flex-row items-center justify-between mt-8 mb-2">
                            <Text className="text-[#070707] font-bold">Order Summary</Text>
                            <Text className="text-[#6B7280] text-xs">
                                {selectedItems.length} of {cart?.items?.length || 0} items selected
                            </Text>
                        </View>
                        <View className="mt-2">
                            {selectedItems.length === 0 ? (
                                <View className="py-10 items-center">
                                    <Text className="text-gray-400 text-center">No items selected</Text>
                                    <TouchableOpacity
                                        onPress={() => router.back()}
                                        className="mt-4 px-6 py-3 bg-[#E95322] rounded-full"
                                    >
                                        <Text className="text-white font-semibold">Go Back to Cart</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                selectedItems.map((item) => (
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
                                        <Text className="text-[#6B7280] text-xs mt-1">
                                            {item.quantity} × ${Number(item.unit_price)}
                                        </Text>
                                    </View>
                                    <Text className="font-bold text-[#E95322]">
                                        ${(Number(item.unit_price) * Number(item.quantity))}
                                    </Text>
                                </View>
                                ))
                            )}
                        </View>

                        <View className="mt-8">
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-[#6B7280]">Subtotal ({selectedItems.length} items)</Text>
                                <Text className="font-semibold text-[#070707]">
                                    ${selectedTotal()}
                                </Text>
                            </View>
                            {cart && Number(cart.tax_amount) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Tax and Fees</Text>
                                    <Text className="font-semibold text-[#070707]">
                                        ${Number(cart.tax_amount)}
                                    </Text>
                                </View>
                            )}
                            {cart && Number(cart.delivery_fee) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Delivery</Text>
                                    <Text className="font-semibold text-[#070707]">
                                        ${Number(cart.delivery_fee)}
                                    </Text>
                                </View>
                            )}
                            {cart && Number(cart.discount_amount) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Discount</Text>
                                    <Text className="font-semibold text-green-600">
                                        -${Number(cart.discount_amount)}
                                    </Text>
                                </View>
                            )}
                            <View className="flex-row justify-between border-t pt-5" style={{ borderTopColor: "#FFD8C7" }}>
                                <Text className="text-lg font-extrabold text-[#070707]">Total</Text>
                                <Text className="text-lg font-extrabold text-[#E95322]">
                                    ${calculateTotal()}
                                </Text>
                            </View>
                        </View>

                        {selectedItems.length > 0 && (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={handlePlaceOrder}
                                disabled={!selectedAddress}
                                className="self-center mt-10 px-16 py-4 rounded-full"
                                style={{ backgroundColor: !selectedAddress ? "#9CA3AF" : "#E95322" }}
                            >
                                <Text className="text-white font-semibold">
                                    {selectedAddress ? `Continue to Payment (${selectedItems.length})` : 'Select Address First'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
