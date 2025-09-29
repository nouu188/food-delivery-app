import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type AddOn = { id: string; name: string; price: number };

const MOCK_ADDONS: AddOn[] = [
    { id: "shrimp", name: "Shrimp", price: 2.99 },
    { id: "onion", name: "Crisp Onions", price: 1.99 },
    { id: "corn", name: "Sweet Corn", price: 1.49 },
    { id: "pico", name: "Pico de Gallo", price: 2.99 },
];

export default function FoodDetail() {
    const router = useRouter();

    const title = "Fresh Prawn Ceviche";
    const basePrice = 50.0;
    const rating = 6.0;
    const image = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop";

    const [qty, setQty] = React.useState(1);
    const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);

    const toggleAddOn = (a: AddOn) => {
        setSelectedAddOns((prev) => (prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]));
    };

    const addOnsTotal = selectedAddOns
        .map((id) => MOCK_ADDONS.find((a) => a.id === id)?.price ?? 0)
        .reduce((s, n) => s + n, 0);

    const total = (basePrice + addOnsTotal) * qty;

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="pt-12 px-5 pb-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="absolute left-5 top-12 w-10 h-10 rounded-full bg-[#F9CF63] items-center justify-center"
                    activeOpacity={0.8}
                >
                    <Ionicons name="chevron-back" size={20} color="#E95322" />
                </TouchableOpacity>

                <View className="items-center mt-2">
                    <Text className="text-[#391713] text-xl font-extrabold">{title}</Text>
                    <View className="mt-2 flex-row items-center">
                        <View className="bg-[#F15A24]/10 px-2 py-1 rounded-full flex-row items-center">
                            <Ionicons name="star" size={12} color="#F15A24" />
                            <Text className="ml-1 text-xs text-[#F15A24] font-semibold">{rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-5 -mt-2">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
                    <Image source={{ uri: image }} className="w-full h-48 rounded-3xl" />

                    <View className="flex-row items-center justify-between mt-4">
                        <Text className="text-[#E95322] text-2xl font-extrabold">${basePrice.toFixed(2)}</Text>

                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => setQty((q) => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-full bg-[#FFE3D6] items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="remove" size={16} color="#E95322" />
                            </TouchableOpacity>
                            <Text className="mx-3 text-[#391713] font-semibold text-base">{qty}</Text>
                            <TouchableOpacity
                                onPress={() => setQty((q) => q + 1)}
                                className="w-8 h-8 rounded-full bg-[#F15A24] items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Mô tả */}
                    <View className="mt-3">
                        <Text className="text-[#391713] font-semibold">Shrimp Ceviche</Text>
                        <Text className="text-[#6B7280] mt-1">
                            Shrimp marinated in zesty lime juice, mixed with crisp onions, tomatoes, and cilantro.
                        </Text>
                    </View>

                    {/* Add on ingredients */}
                    <View className="mt-6">
                        <Text className="text-[#391713] text-lg font-semibold">Add on ingredients</Text>

                        <View className="mt-3 rounded-2xl overflow-hidden border border-[#F2DFA2]">
                            {MOCK_ADDONS.map((a, idx) => {
                                const selected = selectedAddOns.includes(a.id);
                                return (
                                    <View key={a.id}>
                                        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
                                            <Text className="text-[#391713]">{a.name}</Text>

                                            <View className="flex-row items-center">
                                                <Text className="text-[#6B7280] mr-4">${a.price.toFixed(2)}</Text>
                                                <TouchableOpacity
                                                    onPress={() => toggleAddOn(a)}
                                                    className={`w-7 h-7 rounded-full items-center justify-center ${
                                                        selected ? "bg-[#F15A24]" : "bg-[#FFE3D6]"
                                                    }`}
                                                    activeOpacity={0.8}
                                                >
                                                    <Ionicons
                                                        name={selected ? "checkmark" : "add"}
                                                        size={16}
                                                        color={selected ? "#fff" : "#E95322"}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {idx < MOCK_ADDONS.length - 1 && <View className="h-px bg-[#F2DFA2]" />}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                <View className="absolute left-0 right-0 bottom-20 px-5 pb-5 pt-3 bg-white rounded-t-3xl">
                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="bg-[#F15A24] rounded-full py-3 items-center flex-row justify-center"
                        onPress={() => {
                            router.back();
                        }}
                    >
                        <Ionicons name="cart-outline" size={20} color="#fff" />
                        <Text className="text-white text-base font-semibold ml-2">Add to Cart</Text>
                        <Text className="text-white text-base font-bold ml-3">${total.toFixed(2)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
