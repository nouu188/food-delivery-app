import { bestSeller } from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Categories from "@/components/Common/Categories";
import SearchBar from "@/components/Common/SearchBar";

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
        <View className="flex-1 bg-white">
            {/* Header + Search + Categories */}
            <View className="bg-[#F9CF63] px-5 pt-14 pb-4">
                <SearchBar />
                <View
                    className="bg-[#F15A24] rounded-t-3xl pb-10 pt-3 mt-5 -mx-5"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 6 },
                        shadowRadius: 12,
                        elevation: 2,
                    }}
                >
                    <Categories />
                </View>
            </View>

            {/* Phần màu trắng bo góc trên, đè lên phần cam */}
            <View
                className="flex-1 pl-5 pr-10"
                style={{
                    backgroundColor: "#fff",
                    borderTopRightRadius: 32,
                    marginTop: -40,
                    paddingTop: 24,
                }}
            >
                <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
                    {/* Dòng Search Result For / Sort By */}
                    <View className="flex-row items-center justify-between px-1">
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
                    </View>

                    {/* Danh sách kết quả */}
                    <View className="mt-4">
                        {RESULTS.map((item) => (
                            <View
                                key={item.id}
                                className="bg-white rounded-3xl mb-5"
                                style={{
                                    shadowColor: "#000",
                                    shadowOpacity: 0.06,
                                    shadowOffset: { width: 0, height: 6 },
                                    shadowRadius: 12,
                                    elevation: 2,
                                }}
                            >
                                <Image source={item.image} className="w-full h-40 rounded-3xl" />
                                <View className="px-3 py-3">
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-black text-base font-extrabold">{item.title}</Text>
                                        <Text className="text-[#F15A24] font-bold">${item.price.toFixed(2)}</Text>
                                    </View>
                                    <View className="flex-row items-center mt-1">
                                        <View className="flex-row items-center bg-[#F15A24]/10 px-2 py-0.5 rounded-full">
                                            <Ionicons name="star" size={12} color="#F15A24" />
                                            <Text className="text-[11px] text-[#F15A24] ml-1">
                                                {item.rating.toFixed(1)}
                                            </Text>
                                        </View>
                                        <Text numberOfLines={2} className="text-[#6B7280] text-xs ml-2 flex-1">
                                            {item.desc}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}
