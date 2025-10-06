import { SnacksIcon } from "@/assets/icons";
import { recommend } from "@/assets/images";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

type Reco = {
    id: string;
    title: string;
    desc: string;
    price: number;
    rating: number;
    image: any;
    isNew?: boolean;
    icon: any;
};

const DATA: Reco[] = [
    {
        id: "1",
        title: "Chocolate & Fresh Fruit Crepes",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing…",
        price: 15,
        rating: 5.0,
        image: recommend.rcm1,
        isNew: true,
        icon: SnacksIcon,
    },
    {
        id: "2",
        title: "Bean and vegetable burger",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.0,
        image: recommend.rcm2,
        icon: SnacksIcon,
    },
    {
        id: "3",
        title: "Creamy milkshakes",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.6,
        image: recommend.rcm3,
        icon: SnacksIcon,
    },
    {
        id: "4",
        title: "Chicken curry rice",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.8,
        image: recommend.rcm3,
        icon: SnacksIcon,
    },
    {
        id: "5",
        title: "Salmon don",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.7,
        image: recommend.rcm3,
        icon: SnacksIcon,
    },
    {
        id: "6",
        title: "Salmon don",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.7,
        image: recommend.rcm3,
        icon: SnacksIcon,
    },
];

export default function RecommendScreen() {
    const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
        DATA.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
    );

    const handleIncrease = (id: string) => {
        setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    };

    const handleDecrease = (id: string) => {
        setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
    };

    const renderItem = ({ item }: { item: Reco }) => {
        return (
            <View
                className="bg-white rounded-3xl mb-4 overflow-hidden"
                style={{
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 8,
                }}
            >
                <Link href={{ pathname: "/food/[id]", params: { id: item.id } }} asChild>
                    <Pressable>
                        <View className="flex-row">
                            {/* Image section */}
                            <View className="relative w-32 h-32">
                                <Image source={item.image} className="w-full h-full" resizeMode="cover" />
                                {/* Icon */}
                                <View className="absolute left-2 top-2 bg-white w-8 h-8 rounded-full items-center justify-center">
                                    {React.createElement(item.icon, { width: 20, height: 20 })}
                                </View>
                                {/* New tag */}
                                {item.isNew && (
                                    <View className="absolute right-2 top-2 bg-[#F15A24] rounded-full px-2 py-1">
                                        <Text className="text-white text-[10px] font-semibold">New</Text>
                                    </View>
                                )}
                            </View>

                            {/* Content section */}
                            <View className="flex-1 px-4 py-3 justify-between">
                                <View>
                                    <Text numberOfLines={2} className="text-[#391713] text-base font-bold leading-5">
                                        {item.title}
                                    </Text>
                                    <Text numberOfLines={2} className="text-[#9CA3AF] text-xs mt-1 leading-4">
                                        {item.desc}
                                    </Text>
                                </View>

                                {/* Price and controls */}
                                <View className="flex-row items-center justify-between mt-2">
                                    <Text className="text-[#F15A24] text-xl font-bold">${item.price.toFixed(2)}</Text>

                                    <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1">
                                        <TouchableOpacity
                                            onPress={() => handleDecrease(item.id)}
                                            className="w-6 h-6 rounded-full bg-white items-center justify-center"
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="remove" size={14} color="#F15A24" />
                                        </TouchableOpacity>

                                        <Text className="mx-2 text-[#391713] font-semibold text-sm">
                                            {quantities[item.id]}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => handleIncrease(item.id)}
                                            className="w-6 h-6 rounded-full bg-[#F15A24] items-center justify-center"
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="add" size={14} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Link>

                {/* Add to cart button */}
                <TouchableOpacity
                    className="mx-4 mb-4 mt-4 bg-[#F15A24] rounded-full py-2.5 flex-row items-center justify-center"
                    activeOpacity={0.8}
                >
                    <Ionicons name="cart" size={16} color="#FFFFFF" />
                    <Text className="text-white font-semibold ml-2 text-sm">Add to Cart</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            {/* Header */}
            <View className="px-5 pt-20 pb-10">
                <View className="flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={20} color="#E95322" />
                    </Pressable>
                    <Text className="text-white text-3xl font-extrabold">Recommendations</Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Body */}
            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-4">
                <Text className="text-[#E95322] text-xl font-semibold text-center">
                    Discover the dishes{"\n"}recommended by the chef.
                </Text>

                <FlatList
                    data={DATA}
                    keyExtractor={(it) => it.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 90 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}
