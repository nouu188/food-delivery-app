import { bestSeller } from "@/assets/images/index";
import Categories from "@/components/Common/Categories";
import SearchBar from "@/components/Common/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";

const RESULTS = [
    {
        id: "p1",
        title: "Mexican Appetizer",
        price: 15.0,
        rating: 6.0,
        image: bestSeller.BS1,
        desc: "Tortilla Chips With Toppings",
    },
    {
        id: "p2",
        title: "Pork Skewer",
        price: 12.99,
        rating: 4.0,
        image: bestSeller.BS2,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
    },
    {
        id: "p3",
        title: "Pork Skewer 2",
        price: 12.99,
        rating: 4.0,
        image: bestSeller.BS3,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
    },
];

export default function MenuScreen() {
    const [sortBy, setSortBy] = React.useState<"popular" | "price" | "rating">("popular");

    return (
        <View className="flex-1 bg-[#F9CF63]">
            {/* Header + Search + Categories */}
            <View className="pt-8">
                <View className="px-5">
                    <SearchBar />
                </View>
                <View
                    className="bg-[#E95322] pb-10 z-1"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 6 },
                        shadowRadius: 12,
                        elevation: 2,
                        zIndex: 1,
                        transform: [{ translateY: 30 }],
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                    }}
                >
                    <Categories />
                </View>
            </View>

            {/* Phần màu trắng bo góc trên, đè lên phần cam */}
            <View
                className="flex-1 px-9 z-100"
                style={{
                    backgroundColor: "#fff",
                    borderTopRightRadius: 32,
                    borderTopLeftRadius: 32,
                    zIndex: 100,
                }}
            >
                {/* Dòng Search Result For / Sort By */}
                <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="flex-row items-center"
                            onPress={() =>
                                setSortBy(sortBy === "popular" ? "price" : sortBy === "price" ? "rating" : "popular")
                            }
                        >
                            <View className="flex-row items-center">
                                <Text className="text-[#070707] font-semibold">Sort By</Text>
                                <Text className="text-[#E95322] font-normal ml-3">
                                    {sortBy === "popular" ? "Popular" : sortBy === "price" ? "Price" : "Rating"}
                                </Text>
                            </View>
                            <Ionicons name="chevron-down" size={16} color="#F15A24" />
                        </TouchableOpacity>

                    <TouchableOpacity
                        className="w-9 h-9 rounded-full bg-[#E95322] items-center justify-center"
                        onPress={() => { }}
                    >
                        <Ionicons name="options-outline" size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>

                    {/* Danh sách kết quả */}
                    <View className="">
                        {RESULTS.map((item) => (
                            <View
                                key={item.id}
                                className="bg-white rounded-3xl pb-3 mb-5"
                            >
                                <ImageBackground
                                    source={item.image}
                                    style={{ width: "100%", height: 184 }}
                                    imageStyle={{ borderRadius: 36 }}
                                    resizeMode="cover"
                                />
                                <View className="py-3">
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center justify-between gap-3">
                                            <Text className="text-black text-base text-[18px] font-extrabold max-w-[200px]">{item.title}</Text>
                                            <Ionicons name="ellipse" size={8} color="#E95322" />
                                            <View className="flex-row items-center bg-[#E95322] py-0.5 px-2 gap-1 rounded-full">
                                                <Text className="text-[14px] font-bold text-white">
                                                    {item.rating.toFixed(1)}
                                                </Text>
                                                <Ionicons name="star" size={14} color="#F4BA1B" />
                                            </View>
                                        </View>
                                        <Text className="text-[#E95322] font-bold">${item.price.toFixed(2)}</Text>
                                    </View>
                                    <View className="flex-row items-center mt-1 max-w-[210px]">
                                        <Text className="text-[#6B7280] text-[12px] flex-1">
                                            {item.desc}
                                        </Text>
                                    </View>
                                </View>

                                <View className="h-[1px] border-[0.2px] border-[#FFD8C7] mt-4" />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
