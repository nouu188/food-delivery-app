import { recommend } from "@/assets/images";
import { useCartStore } from "@/store/useCartStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type AddOn = { id: string; name: string; price: number };

const MOCK_ADDONS: AddOn[] = [
    { id: "shrimp", name: "Shrimp", price: 2.99 },
    { id: "onion", name: "Crisp Onions", price: 1.99 },
    { id: "corn", name: "Sweet Corn", price: 1.49 },
    { id: "pico", name: "Pico de Gallo", price: 2.99 },
];

export default function FoodDetail() {
    const { addItem } = useCartStore();
    const router = useRouter();

    const title = "Pizza with Pepperoni and Cheese";
    const basePrice = 14.0;
    const oldPrice = 20.0;
    const discount = 30;
    const rating = 6.0;
    const image = recommend.rcm3;

    const [qty, setQty] = React.useState(3);
    const [selectedAddOns, setSelectedAddOns] = React.useState<string[]>([]);
    const [isFavorite, setIsFavorite] = React.useState(false);

    const toggleAddOn = (a: AddOn) => {
        setSelectedAddOns((prev) => (prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]));
    };

    const addOnsTotal = selectedAddOns
        .map((id) => MOCK_ADDONS.find((a) => a.id === id)?.price ?? 0)
        .reduce((s, n) => s + n, 0);

    const total = (basePrice + addOnsTotal) * qty;

    const handleAddToCart = () => {
    addItem({
      id: 1,
      name: title,
      price: basePrice + addOnsTotal,
      qty: qty,
      image: image,
    });

    Toast.show({
      type: "success",
      text1: "Added to cart!",
      text2: `${qty} × ${title}`,
      position: "bottom",
      bottomOffset: 100,
    });
  };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="pt-12 px-5 pb-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={24} color="#E95322" />
                    </TouchableOpacity>

                    <View className="flex-1 items-center">
                        <Text className="text-[#391713] text-lg font-extrabold" numberOfLines={1}>
                            {title}
                        </Text>
                        <View className="mt-1 flex-row items-center">
                            <View className="bg-[#E95322] px-2 py-0.5 rounded-full flex-row items-center">
                                <Text className="text-xs text-white font-semibold">{rating.toFixed(1)}</Text>
                                <Ionicons name="star" size={10} color="#F4BA1B" style={{ marginLeft: 2 }} />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name={isFavorite ? "heart" : "heart-outline"}
                            size={24}
                            color={isFavorite ? "#E95322" : "#E95322"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-5 -mt-2">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View className="relative">
                        <Image source={image} className="w-full h-48 rounded-3xl" resizeMode="cover" />
                        {/* Discount badge */}
                        {discount > 0 && (
                            <View className="absolute right-3 top-3 bg-[#E95322] rounded-full w-14 h-14 items-center justify-center">
                                <Text className="text-white text-lg font-bold">{discount}%</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row items-center justify-between mt-4">
                        <View>
                            <View className="flex-row items-center">
                                <Text className="text-[#E95322] text-2xl font-extrabold">${basePrice.toFixed(2)}</Text>
                                {oldPrice > basePrice && (
                                    <Text className="text-[#9CA3AF] text-sm font-semibold line-through ml-2">
                                        ${oldPrice.toFixed(2)}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1">
                            <TouchableOpacity
                                onPress={() => setQty((q) => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-full bg-white items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="remove" size={16} color="#E95322" />
                            </TouchableOpacity>
                            <Text className="mx-3 text-[#391713] font-semibold text-base">{qty}</Text>
                            <TouchableOpacity
                                onPress={() => setQty((q) => q + 1)}
                                className="w-8 h-8 rounded-full bg-[#E95322] items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Mô tả */}
                    <View className="mt-4">
                        <Text className="text-[#391713] font-bold text-base">Lorem ipsum dolor sit amet</Text>
                        <Text className="text-[#6B7280] text-sm mt-1 leading-5">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore.
                        </Text>
                    </View>

                    {/* Personal portion */}
                    <View className="mt-6">
                        <Text className="text-[#391713] text-lg font-bold">Personal portion</Text>

                        <View className="mt-3 rounded-2xl overflow-hidden border border-[#F2DFA2]">
                            {[
                                { name: "Personal (4 Slides)", price: 0 },
                                { name: "Medium (8 Slides)", price: 3.0 },
                                { name: "Familiar (10 Slides)", price: 6.0 },
                                { name: "Jumbo (12 Slides)", price: 10.0 },
                            ].map((portion, idx, arr) => {
                                const selected = idx === 0;
                                return (
                                    <View key={idx}>
                                        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
                                            <Text className="text-[#391713] text-sm">{portion.name}</Text>

                                            <View className="flex-row items-center">
                                                <Text className="text-[#6B7280] text-sm mr-3">
                                                    ${portion.price.toFixed(2)}
                                                </Text>
                                                <TouchableOpacity
                                                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                                                        selected ? "border-[#E95322] bg-[#E95322]" : "border-[#D1D5DB]"
                                                    }`}
                                                    activeOpacity={0.8}
                                                >
                                                    {selected && <View className="w-2 h-2 rounded-full bg-white" />}
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {idx < arr.length - 1 && <View className="h-px bg-[#F2DFA2]" />}
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Add on ingredients */}
                    <View className="mt-6">
                        <Text className="text-[#391713] text-lg font-bold">Add on ingredients</Text>

                        <View className="mt-3 rounded-2xl overflow-hidden border border-[#F2DFA2]">
                            {MOCK_ADDONS.map((a, idx) => {
                                const selected = selectedAddOns.includes(a.id);
                                return (
                                    <View key={a.id}>
                                        <View className="flex-row items-center justify-between px-4 py-3 bg-white">
                                            <Text className="text-[#391713] text-sm">{a.name}</Text>

                                            <View className="flex-row items-center">
                                                <Text className="text-[#6B7280] text-sm mr-4">
                                                    ${a.price.toFixed(2)}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => toggleAddOn(a)}
                                                    className={`w-7 h-7 rounded-full items-center justify-center ${
                                                        selected ? "bg-[#E95322]" : "bg-[#FFE3D6]"
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

                {/* Add to Cart Button */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    className="bg-[#E95322] rounded-full py-4 items-center flex-row justify-center mb-8 shadow-lg"
                    onPress={handleAddToCart}
                >
                    <Ionicons name="cart-outline" size={22} color="#fff" />
                    <Text className="text-white text-base font-semibold ml-2">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
