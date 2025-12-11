import { SnacksIcon } from "@/assets/icons";
import { recommend } from "@/assets/images/index";
import SearchBar from "@/components/Common/SearchBar";
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
        image: recommend.rcm1,
        desc: "Tortilla Chips With Toppings",
        icon: SnacksIcon,
    },
    {
        id: "p2",
        title: "Pork Skewer",
        price: 12.99,
        rating: 4.0,
        image: recommend.rcm2,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
        icon: SnacksIcon,
    },
    {
        id: "p3",
        title: "Pork Skewer 2",
        price: 12.99,
        rating: 4.0,
        image: recommend.rcm3,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
        icon: SnacksIcon,
    },
    {
        id: "p4",
        title: "Pork Skewer 3",
        price: 12.99,
        rating: 4.0,
        image: recommend.rcm2,
        desc: "Marinated and grilled to perfection, served with a spicy dipping sauce.",
        icon: SnacksIcon,
    },
];

export default function SearchScreen() {
    const [query] = React.useState("ABC");
    const [sortBy, setSortBy] = React.useState<"popular" | "price" | "rating">("popular");

    // Mặc định số lượng mỗi sản phẩm là 0
    const [quantities, setQuantities] = React.useState<{ [key: string]: number }>(
        RESULTS.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {})
    );

    // Tổng tiền
    const [totalPrice, setTotalPrice] = React.useState(0);

    // Hàm tính tổng tiền khi thay đổi số lượng
    const calculateTotalPrice = (newQuantities: { [key: string]: number }) => {
        let total = 0;
        for (const id in newQuantities) {
            const product = RESULTS.find((p) => p.id === id);
            if (product) {
                total += product.price * newQuantities[id];
            }
        }
        setTotalPrice(total);
    };

    const handleIncrease = (id: string) => {
        setQuantities((prev) => {
            const updated = { ...prev, [id]: prev[id] + 1 };
            calculateTotalPrice(updated);
            return updated;
        });
    };

    const handleDecrease = (id: string) => {
        setQuantities((prev) => {
            const updated = { ...prev, [id]: Math.max(0, prev[id] - 1) };
            calculateTotalPrice(updated);
            return updated;
        });
    };

    const handleCheckout = () => {
        // Xử lý thanh toán ở đây
        alert(`Tổng thanh toán: ${totalPrice.toLocaleString("vi-VN")} ₫`);
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
                        <View className="relative overflow-hidden rounded-t-3xl">
                            <Image source={item.image} className="w-full h-52" resizeMode="cover" />
                            {/* Icon */}
                            <View className="absolute left-3 top-3 bg-white w-10 h-10 rounded-full items-center justify-center">
                                {React.createElement(item.icon, { width: 24, height: 24 })}
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
                    <Text className="text-[#E95322] text-2xl font-bold">${item.price.toFixed(2)}</Text>

                    <View className="flex-row items-center">
                        <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1 mr-2">
                            <TouchableOpacity
                                onPress={() => handleDecrease(item.id)}
                                className="w-7 h-7 rounded-full bg-white items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="remove" size={16} color="#E95322" />
                            </TouchableOpacity>

                            <Text className="mx-3 text-[#391713] font-semibold">{quantities[item.id]}</Text>

                            <TouchableOpacity
                                onPress={() => handleIncrease(item.id)}
                                className="w-7 h-7 rounded-full bg-[#E95322] items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="add" size={16} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Add to cart button */}
                        <TouchableOpacity
                            className="w-9 h-9 rounded-full bg-[#E95322] items-center justify-center"
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
            {/* Header + Search */}
            <View className="px-5 pt-16 pb-8">
                <SearchBar isSearchPage={true} />
            </View>

            {/* Body */}
            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-6">
                {/* Search Result For / Sort By */}
                <View className="flex-row items-center justify-between px-5 mb-4">
                    <Text className="text-[#6B7280] text-sm">
                        Search Result For: <Text className="text-[#E95322] font-semibold">{query}</Text>
                    </Text>
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
                        <Ionicons name="chevron-down" size={16} color="#E95322" />
                    </TouchableOpacity>
                </View>

                {/* Product List */}
                <FlatList
                    data={RESULTS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 70 }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            {/* Thanh tổng tiền & nút thanh toán */}
            <View className="absolute bottom-0 left-0 right-0 bg-white p-5 border-t border-gray-200 flex-row justify-between items-center">
                <View>
                    <Text className="text-lg font-semibold text-[#391713]">Total</Text>
                    <Text className="text-2xl font-bold text-[#E95322]">{totalPrice.toLocaleString("vi-VN")} ₫</Text>
                </View>
                <TouchableOpacity
                    onPress={handleCheckout}
                    disabled={totalPrice === 0}
                    className={`${totalPrice === 0 ? "bg-gray-300" : "bg-[#E95322]"} rounded-full px-6 py-3`}
                >
                    <Text className="text-white font-bold text-base">Checkout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
