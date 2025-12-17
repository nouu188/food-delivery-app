import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddressStore } from "@/store/useAddressStore";
import { useCartStore } from "@/store/useCartStore";
import { usePaymentStore } from "@/store/usePaymentStore";

export default function PaymentScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId } = useAddressStore();
    const { items, subtotal } = useCartStore();
    const { methods, selectedMethodId } = usePaymentStore();

    const address = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const method = methods.find((m) => m.id === selectedMethodId) ?? methods[0];

    const sub = subtotal();
    const tax = Math.round(sub * 0.1 * 100) / 100;
    const delivery = items.length ? 3 : 0;
    const total = sub + tax + delivery;

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Payment" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[#070707] font-bold">Shipping Address</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/delivery-address")}>
                            <Text className="text-[#E95322] font-semibold text-xs">Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <Text className="text-[#070707] font-semibold" numberOfLines={1}>
                            {address?.address}
                        </Text>
                    </View>

                    <View className="mt-8 flex-row items-center justify-between">
                        <View>
                            <Text className="text-[#070707] font-bold">Order Summary</Text>
                            <Text className="text-xs text-[#6B7280] mt-1">{items.length} items</Text>
                        </View>
                        <Text className="font-extrabold text-[#070707]">${total.toFixed(2)}</Text>
                    </View>

                    <View className="mt-8 flex-row items-center justify-between">
                        <Text className="text-[#070707] font-bold">Payment Method</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => router.push("/payment-methods")}>
                            <Text className="text-[#E95322] font-semibold text-xs">Edit</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="mt-3 rounded-2xl px-4 py-3" style={{ backgroundColor: "#FFF5D6" }}>
                        <Text className="text-[#070707] font-semibold">{method?.label}</Text>
                    </View>

                    <View className="mt-8 flex-row items-center justify-between">
                        <Text className="text-[#070707] font-bold">Delivery Time</Text>
                        <Text className="text-[#E95322] font-semibold">25 mins</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push("/checkout/order-confirmed")}
                        className="self-center mt-14 px-16 py-3 rounded-full"
                        style={{ backgroundColor: "#FFE3D6" }}
                    >
                        <Text className="text-[#E95322] font-semibold">Pay Now</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
