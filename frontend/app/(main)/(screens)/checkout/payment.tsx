import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAddressStore } from "@/store/useAddressStore";
import { useCartStore } from "@/store/useCartStore";
import orderService from "@/services/api/order.service";
import { PaymentMethod } from "@/types/api/order";
import { showErrorAlert } from "@/utils/error-handler";

const PAYMENT_METHODS: Array<{
    id: PaymentMethod;
    label: string;
    icon: React.ComponentProps<typeof Feather>['name'];
}> = [
    { id: PaymentMethod.COD, label: "Cash on Delivery", icon: "dollar-sign" },
    { id: PaymentMethod.CARD, label: "Credit/Debit Card", icon: "credit-card" },
    { id: PaymentMethod.MOMO, label: "MoMo Wallet", icon: "smartphone" },
    { id: PaymentMethod.VNPAY, label: "VNPay", icon: "smartphone" },
    { id: PaymentMethod.WALLET, label: "App Wallet", icon: "gift" },
];

export default function PaymentScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId } = useAddressStore();
    const { cart, selectedItemIds, removeBulkItems, clearSelection, fetchCart } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PaymentMethod.COD);
    const [isProcessing, setIsProcessing] = useState(false);
    const [specialInstructions, setSpecialInstructions] = useState("");

    const selectedAddress = selectedAddressId
        ? addresses.find(a => a.id === selectedAddressId) || null
        : null;

    const selectedItems = cart?.items?.filter(item => selectedItemIds.has(item.id)) || [];

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            Alert.alert('Error', 'Please select a delivery address');
            return;
        }

        if (selectedItems.length === 0) {
            Alert.alert('Error', 'No items selected for checkout');
            return;
        }

        setIsProcessing(true);
        try {
            const order = await orderService.createOrder({
                delivery_address_id: selectedAddress.id,
                payment_method: selectedPayment,
                special_instructions: specialInstructions.trim() || undefined,
            });

            const selectedIds = Array.from(selectedItemIds);
            await removeBulkItems(selectedIds);

            clearSelection();

            router.replace({
                pathname: '/checkout/order-confirmed',
                params: { orderId: order.id }
            });
        } catch (error) {
            showErrorAlert(error, 'Failed to Place Order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Payment" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

                    <View className="flex-row items-center justify-between">
                        <Text className="text-[#070707] font-bold">Shipping Address</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.back()}>
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

                    <View className="mt-8 flex-row items-center justify-between">
                        <View>
                            <Text className="text-[#070707] font-bold">Order Summary</Text>
                            <Text className="text-xs text-[#6B7280] mt-1">
                                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                            </Text>
                        </View>
                        <Text className="font-extrabold text-[#E95322]">
                            ${selectedItems.reduce((sum, item) => sum + (Number(item.unit_price) * item.quantity), 0).toFixed(2)}
                        </Text>
                    </View>

                    <Text className="mt-8 text-[#070707] font-bold mb-3">Payment Method</Text>
                    <View>
                        {PAYMENT_METHODS.map((method) => (
                            <TouchableOpacity
                                key={method.id}
                                activeOpacity={0.7}
                                onPress={() => setSelectedPayment(method.id)}
                                className="mb-3 rounded-2xl px-4 py-4 flex-row items-center justify-between"
                                style={{
                                    backgroundColor: selectedPayment === method.id ? "#FFE3D6" : "#FFF5D6",
                                    borderWidth: selectedPayment === method.id ? 2 : 0,
                                    borderColor: "#E95322",
                                }}
                            >
                                <View className="flex-row items-center flex-1">
                                    <Feather name={method.icon} size={20} color="#E95322" />
                                    <Text className="text-[#070707] font-semibold ml-3">{method.label}</Text>
                                </View>
                                <View
                                    className="w-5 h-5 rounded-full items-center justify-center"
                                    style={{ borderWidth: 2, borderColor: "#E95322" }}
                                >
                                    {selectedPayment === method.id && (
                                        <View className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E95322" }} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="mt-6 flex-row items-center justify-between py-4 px-4 rounded-2xl" style={{ backgroundColor: "#FFF5D6" }}>
                        <Text className="text-[#070707] font-bold">Estimated Delivery Time</Text>
                        <Text className="text-[#E95322] font-semibold">25-30 mins</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={handlePlaceOrder}
                        disabled={isProcessing || !selectedAddress || selectedItems.length === 0}
                        className="self-center mt-10 px-16 py-4 rounded-full"
                        style={{
                            backgroundColor: (isProcessing || !selectedAddress || selectedItems.length === 0)
                                ? "#9CA3AF"
                                : "#E95322"
                        }}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text className="text-white font-semibold text-base">
                                {selectedItems.length === 0
                                    ? 'No Items Selected'
                                    : selectedPayment === PaymentMethod.COD
                                        ? `Place Order (${selectedItems.length})`
                                        : `Proceed to Payment (${selectedItems.length})`}
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
