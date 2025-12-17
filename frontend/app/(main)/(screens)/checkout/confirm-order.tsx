import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddressStore } from "@/store/useAddressStore";
import { useCartStore } from "@/store/useCartStore";

export default function ConfirmOrderScreen() {
    const router = useRouter();
    const { addresses, selectedAddressId } = useAddressStore();
    const { items, subtotal } = useCartStore();

    const selected = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];
    const sub = subtotal();
    const tax = Math.round(sub * 0.1 * 100) / 100;
    const delivery = items.length ? 3 : 0;
    const total = sub + tax + delivery;

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Confirm Order" />

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
                            {selected?.address}
                        </Text>
                    </View>

                    <Text className="mt-8 text-[#070707] font-bold">Order Summary</Text>
                    <View className="mt-4">
                        {items.map((it) => (
                            <View
                                key={it.id}
                                className="flex-row items-center py-4 border-b"
                                style={{ borderBottomColor: "#FFD8C7" }}
                            >
                                <View
                                    className="w-16 h-16 rounded-2xl overflow-hidden"
                                    style={{ backgroundColor: "#FFE3D6" }}
                                >
                                    {it.image ? (
                                        <Image source={it.image} className="w-full h-full" />
                                    ) : it.imageUri ? (
                                        <Image source={{ uri: it.imageUri }} className="w-full h-full" />
                                    ) : null}
                                </View>
                                <View className="flex-1 ml-4">
                                    <Text className="font-semibold text-[#070707]" numberOfLines={1}>
                                        {it.title}
                                    </Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">{it.qty} items</Text>
                                </View>
                                <Text className="font-bold text-[#E95322]">${(it.price * it.qty).toFixed(2)}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="mt-8">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#6B7280]">Subtotal</Text>
                            <Text className="font-semibold text-[#070707]">${sub.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#6B7280]">Tax and Fees</Text>
                            <Text className="font-semibold text-[#070707]">${tax.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between mb-5">
                            <Text className="text-[#6B7280]">Delivery</Text>
                            <Text className="font-semibold text-[#070707]">${delivery.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between border-t pt-5" style={{ borderTopColor: "#FFD8C7" }}>
                            <Text className="text-lg font-extrabold text-[#070707]">Total</Text>
                            <Text className="text-lg font-extrabold text-[#070707]">${total.toFixed(2)}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push("/checkout/payment")}
                        className="self-center mt-10 px-16 py-3 rounded-full"
                        style={{ backgroundColor: "#FFE3D6" }}
                    >
                        <Text className="text-[#E95322] font-semibold">Place Order</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
