import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddressStore } from "@/store/useAddressStore";
import { useCartStore } from "@/store/useCartStore";
import { showErrorAlert } from "@/utils/error-handler";
import VoucherInput from "@/components/common/voucher/VoucherInput";
import { confirm } from "@/utils/confirm";
import { useToastStore } from "@/store/useToastStore";

export default function ConfirmOrderScreen() {
    const router = useRouter();
    const showToast = useToastStore((s) => s.show);
    const { addresses, selectedAddressId, fetchAddresses } = useAddressStore();
    const {
        cart,
        selectedItemIds,
        selectedTotal,
        isLoading: isCartLoading,
        fetchCart,
        appliedVoucher,
        getDiscountedTotal,
    } = useCartStore();
    const [isLoading, setIsLoading] = useState(true);

    const selectedAddress = selectedAddressId ? addresses.find((a) => a.id === selectedAddressId) || null : null;

    const selectedItems = cart?.items?.filter((item) => selectedItemIds.has(item.id)) || [];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        try {
            await Promise.all([fetchCart(), fetchAddresses()]);
        } catch (error) {
            showErrorAlert(error, "Failed to Load Data");
        } finally {
            setIsLoading(false);
        }
    };

    const calculateTotal = () => {
        const subtotal = selectedTotal();
        const deliveryFee = Number(cart?.delivery_fee) || 0;
        const taxAmount = Number(cart?.tax_amount) || 0;
        const discountAmount = appliedVoucher ? appliedVoucher.discount_amount : Number(cart?.discount_amount) || 0;
        return subtotal + deliveryFee + taxAmount - discountAmount;
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            const ok = await confirm({
                title: "No Address Selected",
                message: "Please select or add a delivery address before placing your order.",
                confirmText: "Add Address",
                cancelText: "Cancel",
            });
            if (ok) router.push("/delivery-address/add");
            return;
        }

        if (selectedItems.length === 0) {
            showToast({
                type: "info",
                title: "No Items Selected",
                message: "Please select items from your cart to checkout.",
            });
            router.back();
            return;
        }

        router.push("/checkout/payment");
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
                        <View
                            className="mt-3 rounded-2xl px-4 py-3"
                            style={{ backgroundColor: selectedAddress ? "#FFF5D6" : "#FEE2E2" }}
                        >
                            {selectedAddress ? (
                                <>
                                    <Text className="text-[#070707] font-semibold">{selectedAddress.label}</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">
                                        {selectedAddress.address_line}, {selectedAddress.ward},{" "}
                                        {selectedAddress.district}, {selectedAddress.city}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-red-600 font-semibold text-sm">
                                        No delivery address selected
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => router.push("/delivery-address/add")}
                                        className="mt-2 self-start"
                                    >
                                        <Text className="text-[#E95322] font-semibold text-xs underline">
                                            Add Address Now
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {cart?.restaurant_id && selectedItems.length > 0 && (
                            <View className="mt-6">
                                <Text className="text-[#070707] font-bold mb-3">Apply Voucher</Text>
                                <VoucherInput restaurantId={cart.restaurant_id} />
                            </View>
                        )}

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
                                                <Image
                                                    source={{ uri: item.menu_item.image_url }}
                                                    className="w-full h-full"
                                                />
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
                                            ${Number(item.unit_price) * Number(item.quantity)}
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>

                        <View className="mt-8">
                            <View className="flex-row justify-between mb-3">
                                <Text className="text-[#6B7280]">Subtotal ({selectedItems.length} items)</Text>
                                <Text className="font-semibold text-[#070707]">${selectedTotal()}</Text>
                            </View>
                            {cart && Number(cart.tax_amount) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Tax and Fees</Text>
                                    <Text className="font-semibold text-[#070707]">${Number(cart.tax_amount)}</Text>
                                </View>
                            )}
                            {cart && Number(cart.delivery_fee) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Delivery</Text>
                                    <Text className="font-semibold text-[#070707]">${Number(cart.delivery_fee)}</Text>
                                </View>
                            )}
                            {appliedVoucher && appliedVoucher.discount_amount > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <View>
                                        <Text className="text-[#6B7280]">Discount</Text>
                                        <Text className="text-[#10B981] text-xs font-semibold mt-0.5">
                                            {appliedVoucher.voucher.code}
                                        </Text>
                                    </View>
                                    <Text className="font-semibold text-green-600">
                                        -${appliedVoucher.discount_amount.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            {!appliedVoucher && cart && Number(cart.discount_amount) > 0 && (
                                <View className="flex-row justify-between mb-3">
                                    <Text className="text-[#6B7280]">Discount</Text>
                                    <Text className="font-semibold text-green-600">
                                        -${Number(cart.discount_amount)}
                                    </Text>
                                </View>
                            )}
                            <View
                                className="flex-row justify-between border-t pt-5"
                                style={{ borderTopColor: "#FFD8C7" }}
                            >
                                <Text className="text-lg font-extrabold text-[#070707]">Total</Text>
                                <Text className="text-lg font-extrabold text-[#E95322]">${calculateTotal()}</Text>
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
                                    {selectedAddress
                                        ? `Continue to Payment (${selectedItems.length})`
                                        : "Select Address First"}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
}
