import { SnacksIcon } from "@/assets/icons";
import { bestSeller } from "@/assets/images/index";
import Categories from "@/components/Common/Categories";
import SearchBar from "@/components/Common/SearchBar";
import StarIcon from "@/components/Common/StarIcon";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from "react-native";

const RESULTS = [
    {
        id: "p1",
        title: "Mexican Appetizer",
        price: 15.0,
        rating: 6.0,
        image: bestSeller.BS1,
        desc: "Tortilla Chips With Toppings",
        icon: SnacksIcon,
    },
    {
        id: "p2",
        title: "Pork Skewer",
        price: 12.99,
        rating: 4.0,
        image: bestSeller.BS2,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
        icon: SnacksIcon,
    },
    {
        id: "p3",
        title: "Pork Skewer 2",
        price: 12.99,
        rating: 4.0,
        image: bestSeller.BS3,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
        icon: SnacksIcon,
    },
    {
        id: "p4",
        title: "Grilled Chicken",
        price: 14.5,
        rating: 4.5,
        image: bestSeller.BS1,
        desc: "Juicy grilled chicken with herbs and spices.",
        icon: SnacksIcon,
    },
];

export default function MenuScreen() {
    const [sortBy, setSortBy] = React.useState<"popular" | "price" | "rating">("popular");
    const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
        RESULTS.reduce((acc, item) => ({ ...acc, [item.id]: 1 }), {})
    );

    const handleIncrease = (id: string) => {
        setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    };

    const handleDecrease = (id: string) => {
        setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
    };

    const renderItem = ({ item }: { item: (typeof RESULTS)[0] }) => {
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
                            {/* Rating badge */}
                            <View className="absolute right-3 top-3 bg-white/90 rounded-full px-2 py-1 flex-row items-center">
                                <StarIcon size={12} color="#F15A24" />
                                <Text className="text-[#F15A24] text-xs font-bold ml-1">{item.rating.toFixed(1)}</Text>
                            </View>
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
            {/* Header + Search + Categories */}
            <View className="bg-[#F9CF63] px-5 pt-14 pb-4">
                <SearchBar isSearchPage={true} />
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

            {/* Phần màu trắng bo góc trên */}
            <View
                className="flex-1"
                style={{
                    backgroundColor: "#fff",
                    borderTopRightRadius: 32,
                    borderTopLeftRadius: 32,
                    zIndex: 100,
                }}
            >
                {/* Dòng Sort By */}
                <View className="flex-row items-center justify-between px-5 mb-4">
                    <View className="w-20" />
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="flex-row items-center"
                        onPress={() =>
                            setSortBy(sortBy === "popular" ? "price" : sortBy === "price" ? "rating" : "popular")
                        }
                    >
                        <Text className="text-[#070707] font-semibold text-sm mr-1">
                            Sort By{" "}
                            <Text className="text-[#E95322]">
                                {sortBy === "popular" ? "Popular" : sortBy === "price" ? "Price" : "Rating"}
                            </Text>
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#F15A24" />
                    </TouchableOpacity>
                </View>

                {/* Danh sách kết quả */}
                <FlatList
                    data={RESULTS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}
