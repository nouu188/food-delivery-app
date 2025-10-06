import { banners, bestSeller, recommend } from "@/assets/images/index";
import Categories from "@/components/Common/Categories";
import SearchBar from "@/components/Common/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";

// Fake data
const BEST_SELLERS = [
    { id: "1", title: "Burger Deluxe", price: 10.3, image: bestSeller.BS1 },
    { id: "2", title: "Chicken Bowl", price: 8.5, image: bestSeller.BS2 },
    { id: "3", title: "Salad Fresh", price: 6.9, image: bestSeller.BS3 },
    { id: "4", title: "Yogurt Mix", price: 5.2, image: bestSeller.BS4 },
];

const BANNERS = [
    {
        id: "b1",
        image: banners.banner1,
        title: "Experience our delicious new dish",
        subtitle: "30% OFF",
    },
    { id: "b2", image: banners.banner1, title: "Try our new pasta", subtitle: "TODAY ONLY" },
    {
        id: "b3",
        image: banners.banner1,
        title: "Fresh sushi everyday",
        subtitle: "BEST PRICE",
    },
];

const RECOMMEND = [
    { id: "r1", title: "Beef Burger", price: 10.8, rating: 5.0, image: recommend.rcm1 },
    { id: "r2", title: "Veggy Wrap", price: 9.2, rating: 4.8, image: recommend.rcm2 },
];

const HomeScreen = () => {
    const [activeBanner, setActiveBanner] = React.useState(0);
    const { width } = useWindowDimensions();
    const bannerWidth = width - 40;

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-5 pt-12 pb-4">
                {/* Phần thanh search và icon */}
                <SearchBar />

                {/* Greeting texts */}
                <View className="mt-5">
                    <Text className="text-white text-3xl font-extrabold">Good Morning</Text>
                    <Text className="text-[#F15A24] text-xl font-bold mt-1">
                        Rise And Shine! It&#39;s Breakfast Time
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                <ScrollView className="flex-1 rounded-t-3xl" contentContainerStyle={{ paddingBottom: 60 }}>
                    {/* Categories */}
                    <Categories />

                    {/* Best Seller */}
                    <View className="px-5 mt-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-semibold text-[#151312]">Best Seller</Text>
                            <Link href="/bestSeller" asChild>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-[#F15A24] mr-1">View All</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#F15A24" />
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                            {BEST_SELLERS.map((p) => (
                                <View key={p.id} className="mx-2" style={{ width: 130 }}>
                                    <Link href={{ pathname: "/food/[id]", params: { id: p.id } }} asChild>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image
                                                source={p.image}
                                                className="h-28 w-full rounded-2xl"
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </Link>
                                    <View className="absolute right-3 top-3 bg-[#F15A24] rounded-full px-2 py-1">
                                        <Text className="text-white text-xs">${p.price.toFixed(2)}</Text>
                                    </View>
                                    <Text className="mt-2 font-medium text-[#151312]" numberOfLines={1}>
                                        {p.title}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Promo Banner */}
                    <View className="px-5 mt-6">
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(e) => {
                                const x = e.nativeEvent.contentOffset.x;
                                const page = Math.round(x / bannerWidth);
                                if (page !== activeBanner) setActiveBanner(page);
                            }}
                            scrollEventThrottle={16}
                        >
                            {BANNERS.map((b) => (
                                <View key={b.id} style={{ width: bannerWidth }} className="mr-3">
                                    <ImageBackground
                                        source={b.image}
                                        className="h-36 rounded-3xl overflow-hidden flex-row"
                                        resizeMode="cover"
                                    >
                                        {(b.title || b.subtitle) && (
                                            <View className="flex-1 justify-center pl-4">
                                                {!!b.title && (
                                                    <Text
                                                        className="text-white text-base font-semibold mr-3"
                                                        numberOfLines={2}
                                                    >
                                                        {b.title}
                                                    </Text>
                                                )}
                                                {!!b.subtitle && (
                                                    <Text className="text-white text-3xl font-extrabold mt-1">
                                                        {b.subtitle}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </ImageBackground>
                                </View>
                            ))}
                        </ScrollView>
                        <View className="flex-row items-center justify-center mt-3">
                            {BANNERS.map((_, i) => (
                                <View
                                    key={i}
                                    className={`h-1.5 rounded-full mx-1 ${
                                        i === activeBanner ? "bg-[#F15A24] w-6" : "bg-[#F5D8B8] w-3"
                                    }`}
                                />
                            ))}
                        </View>
                    </View>

                    {/* Recommend grid */}
                    <View className="px-5 mt-6 pb-4">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-semibold text-[#151312]">Recommend</Text>
                            <Link href="/recommend" asChild>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-[#F15A24] mr-1">View All</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#F15A24" />
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <View className="flex-row flex-wrap -mx-2">
                            {RECOMMEND.map((p) => (
                                <View key={p.id} className="w-1/2 px-2 mb-4">
                                    <Link href={{ pathname: "/food/[id]", params: { id: p.id } }} asChild>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image
                                                source={p.image}
                                                className="rounded-2xl h-32 w-full"
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </Link>
                                    <View className="absolute left-4 top-3 bg-white/95 rounded-full px-2 py-1 flex-row items-center">
                                        <Text className="text-[#151312] text-[11px] mr-1">{p.rating.toFixed(1)}</Text>
                                        <Ionicons name="star" size={12} color="#F6B100" />
                                    </View>
                                    <View className="absolute right-4 top-3 bg-white/90 rounded-full px-2 py-1">
                                        <Text className="text-[#F15A24] text-xs font-semibold">
                                            ${p.price.toFixed(2)}
                                        </Text>
                                    </View>
                                    <Text className="mt-2 font-medium text-[#151312]" numberOfLines={1}>
                                        {p.title}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

export default HomeScreen;
