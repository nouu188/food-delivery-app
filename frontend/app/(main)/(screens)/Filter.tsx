import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Star } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View, Animated } from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import { RestaurantCategory } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";

const Filter = () => {
    const params = useLocalSearchParams<{
        initialCategory?: string;
        initialRating?: string;
        initialPrice?: string;
    }>();

    const [categories, setCategories] = useState<RestaurantCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(params.initialCategory);
    const [rating, setRating] = useState(params.initialRating ? parseInt(params.initialRating) : 0);
    const [price, setPrice] = useState(params.initialPrice ? parseInt(params.initialPrice) : 50);
    const [hasFilters, setHasFilters] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        setHasFilters(!!selectedCategory || rating > 0 || price < 100);
    }, [selectedCategory, rating, price]);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const categoriesData = await restaurantService.getCategories();

            if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else {
                setCategories([]);
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Categories');
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId === selectedCategory ? undefined : categoryId);
    };

    const handleApplyFilters = () => {
        const filterParams: Record<string, string> = {};

        if (selectedCategory) {
            filterParams.category = selectedCategory; 
        }

        if (rating > 0) {
            filterParams.minRating = rating.toString();
        }

        if (price && price < 100) {
            filterParams.maxPrice = price.toString();
        }

        router.push({
            pathname: '/Search',
            params: filterParams,
        });
    };

    const handleClearFilters = () => {
        setSelectedCategory(undefined);
        setRating(0);
        setPrice(50);
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-6 pt-16 pb-8">
                <View className="flex-row items-center justify-between mb-2">
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons name="chevron-back-outline" size={28} color="#E95322" />
                    </TouchableOpacity>

                    <Text className="text-3xl font-bold text-white">Filters</Text>

                    {hasFilters && (
                        <TouchableOpacity onPress={handleClearFilters} activeOpacity={0.7}>
                            <Text className="text-[#E95322] font-semibold text-[16px]">Clear</Text>
                        </TouchableOpacity>
                    )}
                    {!hasFilters && <View style={{ width: 50 }} />}
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl pl-5 pt-5 -mt-3">
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading filters...</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
                        <View className="mb-6">
                            <View className="flex-row items-center mb-3">
                                <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#E95322" />
                                <Text className="text-xl font-bold text-[#391713] ml-2">Categories</Text>
                            </View>
                            {categories.length > 0 ? (
                                <View className="flex-row flex-wrap gap-2 pr-5">
                                    {categories.map((category) => {
                                        const active = selectedCategory === category.id;
                                        return (
                                            <TouchableOpacity
                                                key={category.id}
                                                onPress={() => handleCategorySelect(category.id)}
                                                activeOpacity={0.8}
                                                className={`px-5 py-3 rounded-full shadow-sm ${active ? "bg-[#E95322]" : "bg-[#FFE3D6]"}`}
                                                style={{
                                                    shadowColor: active ? "#E95322" : "#000",
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: active ? 0.3 : 0.1,
                                                    shadowRadius: 4,
                                                    elevation: active ? 4 : 2,
                                                }}
                                            >
                                                <Text className={`${active ? "text-white" : "text-[#E95322]"} font-semibold text-sm`}>
                                                    {category.name}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : (
                                <View className="py-4 px-4 bg-gray-50 rounded-xl">
                                    <Text className="text-gray-500 text-center">No categories available</Text>
                                </View>
                            )}
                        </View>
                        <View className="h-px bg-[#E5E7EB] mb-6" />

                        {/* Rating Section */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-3">
                                <Star size={24} color="#E95322" fill="#E95322" />
                                <Text className="text-xl font-bold text-[#391713] ml-2">Minimum Rating</Text>
                            </View>
                            <View className="bg-[#FFF5E6] rounded-2xl p-4">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-2">
                                        {Array.from({ length: 5 }).map((_, i) => {
                                            const starValue = i + 1;
                                            const isFilled = starValue <= rating;
                                            return (
                                                <TouchableOpacity
                                                    key={i}
                                                    onPress={() => setRating(starValue === rating ? 0 : starValue)}
                                                    activeOpacity={0.7}
                                                >
                                                    <Star
                                                        size={32}
                                                        color="#E95322"
                                                        fill={isFilled ? "#E95322" : "transparent"}
                                                    />
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                    {rating > 0 && (
                                        <View className="bg-[#E95322] px-3 py-1 rounded-full">
                                            <Text className="text-white font-bold">{rating}+</Text>
                                        </View>
                                    )}
                                </View>
                                {rating > 0 && (
                                    <Text className="text-[#6B7280] text-sm mt-2">
                                        Show restaurants with {rating}+ star ratings
                                    </Text>
                                )}
                            </View>
                        </View>
                        <View className="h-px bg-[#E5E7EB] mb-6" />

                        {/* Price Section */}
                        <View className="mb-8">
                            <View className="flex-row items-center mb-3">
                                <Ionicons name="cash-outline" size={24} color="#E95322" />
                                <Text className="text-xl font-bold text-[#391713] ml-2">Maximum Price</Text>
                            </View>
                            <View className="bg-[#FFF5E6] rounded-2xl p-4">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-[#6B7280] font-semibold">Price range</Text>
                                    <View className="bg-[#E95322] px-4 py-2 rounded-full">
                                        <Text className="text-white font-bold">
                                            {price >= 100 ? "All" : `$${price}`}
                                        </Text>
                                    </View>
                                </View>
                                <Slider
                                    style={{ height: 44 }}
                                    minimumValue={1}
                                    maximumValue={100}
                                    step={5}
                                    value={price}
                                    onValueChange={(v: number | number[]) => setPrice(Array.isArray(v) ? v[0] : v)}
                                    minimumTrackTintColor="#E95322"
                                    maximumTrackTintColor="#E5E7EB"
                                    thumbTintColor="#E95322"
                                />
                                <View className="flex-row justify-between mt-1">
                                    <Text className="text-[#6B7280] text-xs">$1</Text>
                                    <Text className="text-[#6B7280] text-xs">$25</Text>
                                    <Text className="text-[#6B7280] text-xs">$50</Text>
                                    <Text className="text-[#6B7280] text-xs">$75</Text>
                                    <Text className="text-[#6B7280] text-xs">$100+</Text>
                                </View>
                                <Text className="text-[#6B7280] text-sm mt-2">
                                    {price >= 100
                                        ? "Show all restaurants regardless of price"
                                        : `Show restaurants with max price of $${price}`}
                                </Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 mt-6">
                            {hasFilters && (
                                <TouchableOpacity
                                    className="flex-1 bg-gray-200 rounded-full items-center py-4"
                                    activeOpacity={0.8}
                                    onPress={handleClearFilters}
                                >
                                    <Text className="text-[#391713] font-bold text-base">Clear All</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                className={`${hasFilters ? 'flex-1' : 'self-center px-20'} bg-[#E95322] rounded-full items-center py-4 shadow-lg`}
                                activeOpacity={0.8}
                                onPress={handleApplyFilters}
                                style={{
                                    shadowColor: "#E95322",
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                    elevation: 8,
                                }}
                            >
                                <Text className="text-white font-bold text-base">Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default Filter;
