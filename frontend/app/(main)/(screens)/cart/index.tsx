import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "@/store/useCartStore";

export default function CartScreen() {
    const router = useRouter();
    const { items, increment, decrement, removeItem, subtotal } = useCartStore();

    const sub = subtotal();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Cart" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
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
                                <Text className="text-[#E95322] font-bold mt-1">${it.price.toFixed(2)}</Text>

                                <View className="flex-row items-center mt-3">
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => decrement(it.id)}
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: "#FFE3D6" }}
                                    >
                                        <Text className="text-[#E95322] font-extrabold">-</Text>
                                    </TouchableOpacity>
                                    <Text className="mx-4 font-extrabold text-[#070707]">{it.qty}</Text>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => increment(it.id)}
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: "#E95322" }}
                                    >
                                        <Text className="text-white font-extrabold">+</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => removeItem(it.id)}
                                        className="ml-auto px-4 py-2 rounded-full"
                                        style={{ backgroundColor: "#FFE3D6" }}
                                    >
                                        <Text className="text-[#E95322] font-semibold">Remove</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}

                    {!items.length && <Text className="text-center text-[#6B7280] mt-10">Your cart is empty</Text>}

                    <View className="mt-8 flex-row items-center justify-between">
                        <Text className="text-lg font-extrabold text-[#070707]">Subtotal</Text>
                        <Text className="text-lg font-extrabold text-[#070707]">${sub.toFixed(2)}</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        disabled={!items.length}
                        onPress={() => router.push("/checkout/confirm-order")}
                        className="self-center mt-10 px-16 py-3 rounded-full"
                        style={{ backgroundColor: "#E95322", opacity: items.length ? 1 : 0.5 }}
                    >
                        <Text className="text-white font-semibold">Checkout</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
