import { SnacksIcon } from "@/assets/icons";
import { recommend } from "@/assets/images";
import StarIcon from "@/components/Common/StarIcon";
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
        title: "Salmon don 2",
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
                        <View className="relative">
                            <Image source={item.image} className="w-full h-52" resizeMode="cover" />
                            {/* Icon */}
                            <View className="absolute left-3 top-3 bg-white w-10 h-10 rounded-full items-center justify-center">
                                {React.createElement(item.icon, { width: 24, height: 24 })}
                            </View>
                            {/* New tag hoặc Rating badge */}
                            {item.isNew ? (
                                <View className="absolute right-3 top-3 bg-[#F15A24] rounded-full px-3 py-1">
                                    <Text className="text-white text-xs font-semibold">New</Text>
                                </View>
                            ) : (
                                <View className="absolute right-3 top-3 bg-white/90 rounded-full px-2 py-1 flex-row items-center">
                                    <StarIcon size={12} color="#F15A24" />
                                    <Text className="text-[#F15A24] text-xs font-bold ml-1">
                                        {item.rating.toFixed(1)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="px-4 py-3">
                            <Text numberOfLines={1} className="text-[#391713] text-lg font-bold leading-5">
                                {item.title}
                            </Text>
                            <Text numberOfLines={2} className="text-[#9CA3AF] text-sm mt-1 leading-4">
                                {item.desc}
                            </Text>
                        </View>
                    </Pressable>
                </Link>

                {/* Price and quantity controls */}
                <View className="px-4 pb-4 flex-row items-center justify-between">
                    <Text className="text-[#F15A24] text-2xl font-bold">${item.price.toFixed(2)}</Text>

                    <View className="flex-row items-center">
                        <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1 mr-2">
                            <TouchableOpacity
                                onPress={() => handleDecrease(item.id)}
                                className="w-7 h-7 rounded-full bg-white items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="remove" size={16} color="#F15A24" />
                            </TouchableOpacity>

                            <Text className="mx-3 text-[#391713] font-semibold">{quantities[item.id]}</Text>

                            <TouchableOpacity
                                onPress={() => handleIncrease(item.id)}
                                className="w-7 h-7 rounded-full bg-[#F15A24] items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="add" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Add to cart button */}
                        <TouchableOpacity
                            className="w-9 h-9 rounded-full bg-[#F15A24] items-center justify-center"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="cart" size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            {/* Header */}
            <View className="px-5 pt-16 pb-8">
                <View className="flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#914025" />
                    </Pressable>
                    <Text className="text-[#914025] text-xl font-bold">Recommendations</Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Body */}
            <View className="flex-1 bg-white rounded-t-3xl -mt-2 -mb-20 pt-6">
                <Text className="text-[#E95322] text-lg font-semibold text-center px-5 mb-4">
                    Discover the dishes{"\n"}recommended by the chef.
                </Text>

                <FlatList
                    data={DATA}
                    keyExtractor={(it) => it.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}
