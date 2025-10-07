import { HeartActiveIcon, HeartDefaultIcon } from "@/assets/icons";
import { banners, bestSeller, recommend } from "@/assets/images/index";
import Categories from "@/components/Common/Categories";
import SearchBar from "@/components/Common/SearchBar";
import StarIcon from "@/components/Common/StarIcon";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Carousel from 'react-native-reanimated-carousel';

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
    const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
    const { width } = useWindowDimensions();
    const bannerWidth = width - 40;

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-5 pt-12 pb-4">
                {/* Phần thanh search và icon */}
                <SearchBar isSearchPage={false} />

                {/* Greeting texts */}
                <View className="mt-5">
                    <Text className="text-white text-3xl font-extrabold">Good Morning</Text>
                    <Text className="text-[#E95322] text-xl font-bold mt-1">
                        Rise And Shine! It&#39;s Breakfast Time
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                {/* Categories */}
                <View className="mb-5">
                    <Categories />
                </View>

                <ScrollView className="flex-1 rounded-t-3xl" contentContainerStyle={{ paddingBottom: 60 }}>
                    {/* Best Seller */}
                    <View className="px-5">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-semibold text-[#151312]">Best Seller</Text>
                            <Link href="/bestSeller" asChild>
                                <TouchableOpacity className="flex-row items-center">
                                    <Text className="text-[#E95322] mr-1">View All</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#E95322" />
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                            {BEST_SELLERS.map((p) => (
                                <View key={p.id} className="mx-2" style={{ width: 110 }}>
                                    <Link href={{ pathname: "/food/[id]", params: { id: p.id } }} asChild>
                                        <TouchableOpacity>
                                            <Image
                                                source={p.image}
                                                className="h-[128px] w-full rounded-[24px]"
                                                resizeMode="cover"
                                            />
                                        </TouchableOpacity>
                                    </Link>
                                    <View
                                        className="absolute bottom-12 -right-0 bg-[#F15A24] px-3 py-2 shadow-md"
                                        style={{
                                            borderTopLeftRadius: 20,
                                            borderBottomLeftRadius: 20,
                                        }}
                                    >
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
                        <Carousel
                            width={bannerWidth}
                            height={164}
                            data={BANNERS}
                            autoPlay
                            autoPlayInterval={3000}
                            scrollAnimationDuration={800}
                            onSnapToItem={(index) => setActiveIndex(index)}
                            renderItem={({ item }) => (
                                <View className="rounded-3xl overflow-hidden mr-3">
                                    <ImageBackground
                                        source={item.image}
                                        resizeMode="cover"
                                        className="h-[164px] flex-row"
                                    >
                                        {(item.title || item.subtitle) && (
                                            <View className="flex-1 justify-center pl-4">
                                                {!!item.title && (
                                                    <Text
                                                        className="text-white text-base font-semibold mr-3"
                                                        numberOfLines={2}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                )}
                                                {!!item.subtitle && (
                                                    <Text className="text-white text-3xl font-extrabold mt-1">
                                                        {item.subtitle}
                                                    </Text>
                                                )}
                                            </View>
                                        )}
                                    </ImageBackground>
                                </View>
                            )}
                        />

                        {/* Dots indicator */}
                        <View className="flex-row items-center justify-center mt-3">
                            {BANNERS.map((_, i) => (
                                <View
                                    key={i}
                                    className={`h-1.5 rounded-full mx-1 ${i === activeIndex ? 'bg-[#E95322] w-6' : 'bg-[#F5D8B8] w-3'
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
                                    <Text className="text-[#E95322] mr-1">View All</Text>
                                    <Ionicons name="chevron-forward" size={16} color="#E95322" />
                                </TouchableOpacity>
                            </Link>
                        </View>
                        <View className="flex-row flex-wrap -mx-2">
                            {RECOMMEND.map((p) => (
                                <View key={p.id} className="w-1/2 px-2 mb-6">
                                    <View className="relative">
                                        <Link href={{ pathname: "/food/[id]", params: { id: p.id } }} asChild>
                                            <TouchableOpacity activeOpacity={0.8}>
                                                <Image
                                                    source={p.image}
                                                    className="rounded-3xl h-40 w-full"
                                                    resizeMode="cover"
                                                />
                                            </TouchableOpacity>
                                        </Link>

                                        {/* Rating badge - top left */}
                                        <View className="absolute left-3 top-3 bg-white/95 rounded-full px-2.5 py-1.5 flex-row items-center shadow-sm">
                                            <Text className="text-[#151312] text-xs font-semibold mr-1">
                                                {p.rating.toFixed(1)}
                                            </Text>
                                            <StarIcon size={12} color="#F4BA1B" />
                                        </View>

                                        {/* Heart icon - top right */}
                                        <TouchableOpacity
                                            onPress={() => toggleFavorite(p.id)}
                                            className="absolute right-3 top-3 bg-white/95 rounded-full p-2 shadow-sm"
                                            activeOpacity={0.7}
                                        >
                                            {favorites.has(p.id) ? <HeartActiveIcon /> : <HeartDefaultIcon />}
                                        </TouchableOpacity>

                                        {/* Price badge - bottom right, outside image */}
                                        <View
                                            className="absolute bottom-5 -right-0 bg-[#F15A24] px-3 py-2 shadow-md"
                                            style={{
                                                borderTopLeftRadius: 20,
                                                borderBottomLeftRadius: 20,
                                            }}
                                        >
                                            <Text className="text-white text-sm font-bold">${p.price.toFixed(1)}</Text>
                                        </View>
                                    </View>

                                    {/* Title */}
                                    <Text className="mt-4 font-semibold text-[#151312] text-base" numberOfLines={1}>
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
