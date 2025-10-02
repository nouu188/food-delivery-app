import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

type Reco = {
    id: string;
    title: string;
    desc: string;
    price: number;
    rating: number;
    image: string;
    isNew?: boolean;
};

const DATA: Reco[] = [
    {
        id: "1",
        title: "Chocolate & Fresh Fruit Crepes",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing…",
        price: 15,
        rating: 5.0,
        image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
        isNew: true,
    },
    {
        id: "2",
        title: "Bean and vegetable burger",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.0,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Creamy milkshakes",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Chicken curry rice",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=1200&auto=format&fit=crop",
    },
    {
        id: "5",
        title: "Salmon don",
        desc: "Lorem ipsum dolor sit amet, consectetur…",
        price: 15,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    },
];

export default function RecommendScreen() {
    const renderItem = ({ item, index }: { item: Reco; index: number }) => {
        return (
            <Link href={{ pathname: "/food/[id]", params: { id: item.id } }} asChild>
                <Pressable
                    className="bg-white rounded-2xl mb-5 overflow-hidden"
                    style={{
                        width: "48%",
                        marginRight: index % 2 === 0 ? "4%" : 0,
                        elevation: 2,
                        shadowColor: "#000",
                        shadowOpacity: 0.06,
                        shadowOffset: { width: 0, height: 6 },
                        shadowRadius: 12,
                    }}
                >
                    <View className="relative">
                        <Image source={{ uri: item.image }} className="w-full h-32" />
                        {/* Rating badge */}
                        <View className="absolute left-2 top-2 bg-white/90 rounded-full px-2 py-1 flex-row items-center">
                            <Ionicons name="star" size={12} color="#F15A24" />
                            <Text className="ml-1 text-[11px] text-[#F15A24] font-semibold">
                                {item.rating.toFixed(1)}
                            </Text>
                        </View>
                        {/* New tag */}
                        {item.isNew && (
                            <View className="absolute right-2 top-2 bg-[#F15A24] rounded-full px-2 py-1">
                                <Text className="text-white text-[10px] font-semibold">New Product</Text>
                            </View>
                        )}
                    </View>

                    <View className="px-3 py-3">
                        <Text numberOfLines={2} className="text-black font-semibold">
                            {item.title}
                        </Text>
                        <Text numberOfLines={2} className="text-[#6B7280] text-xs mt-1">
                            {item.desc}
                        </Text>

                        <View className="flex-row items-center justify-between mt-2">
                            <Text className="text-[#F15A24] font-bold">${item.price.toFixed(2)}</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="time-outline" size={13} color="#F15A24" />
                                <Text className="text-[11px] text-[#F15A24] ml-1">10</Text>
                                <Ionicons name="flame-outline" size={13} color="#F15A24" className="ml-2" />
                                <Text className="text-[11px] text-[#F15A24] ml-1">80</Text>
                                <Ionicons name="ellipse" size={4} color="#F15A24" className="ml-2" />
                            </View>
                        </View>
                    </View>
                </Pressable>
            </Link>
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
                    <Text className="text-white text-2xl font-extrabold">Recommendations</Text>
                    <View className="w-10" />
                </View>
            </View>

            {/* Body */}
            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-4">
                <Text className="text-[#E95322] text-base font-semibold text-center">
                    Discover the dishes{"\n"}recommended by the chef.
                </Text>

                <FlatList
                    data={DATA}
                    keyExtractor={(it) => it.id}
                    numColumns={2}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 90 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}
