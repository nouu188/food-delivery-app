import { Categories } from "@/components/common";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Star } from "@tamagui/lucide-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
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
    const [price, setPrice] = useState(params.initialPrice ? parseInt(params.initialPrice) : 10);

    useEffect(() => {
        fetchCategories();
    }, []);

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

        if (price && price > 1) {
            filterParams.maxPrice = price.toString();
        }

        router.push({
            pathname: '/Search',
            params: filterParams,
        });
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-8 pt-16 pb-10">
                <View className="flex-row items-center gap-3 justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3" activeOpacity={0.7}>
                        <Ionicons name="chevron-back-outline" size={20} color="#E95322" />
                    </TouchableOpacity>

                    <View>
                        <Text className="text-3xl font-bold text-white mr-8">Filter</Text>
                    </View>

                    <View></View>
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
                        <Text className="text-2xl font-semibold text-[#391713] px-1">Categories</Text>
                        {categories.length > 0 ? (
                            <View className="flex-row flex-wrap gap-2 mt-3 pr-5">
                                {categories.map((category) => {
                                    const active = selectedCategory === category.id;
                                    return (
                                        <TouchableOpacity
                                            key={category.id}
                                            onPress={() => handleCategorySelect(category.id)}
                                            activeOpacity={0.8}
                                            className={`px-4 py-2 rounded-full ${active ? "bg-[#E95322]" : "bg-[#FFE3D6]"}`}
                                        >
                                            <Text className={`${active ? "text-white" : "text-[#E95322]"} font-semibold`}>
                                                {category.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ) : (
                            <Text className="text-gray-500 mt-2">No categories available</Text>
                        )}
                        <View className="h-px bg-[#F2DFA2] mt-3" />

                        <View className="mt-4">
                            <Text className="text-2xl font-semibold text-[#391713] px-1">Minimum Rating</Text>
                            <View className="mt-2 px-1 flex-row items-center gap-4">
                                <Text className="text-[#6B7280]">Minimum:</Text>
                                <View className="flex-row">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const starValue = i + 1;
                                        const isFilled = starValue <= rating;
                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                onPress={() => setRating(starValue === rating ? 0 : starValue)}
                                                activeOpacity={0.7}
                                                className="mr-1"
                                            >
                                                <Star
                                                    size={25}
                                                    color="#E95322"
                                                    fill={isFilled ? "#E95322" : "transparent"}
                                                />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                                {rating > 0 && (
                                    <Text className="text-[#E95322] font-semibold">{rating}+ Stars</Text>
                                )}
                            </View>
                            <View className="h-px bg-[#F2DFA2] mt-4" />
                        </View>

                    <View className="mt-4">
                        <Text className="text-2xl font-semibold text-[#391713] px-1">Price</Text>
                        <View className="mt-3 px-1 pr-6">
                            <Slider
                                style={{ height: 44 }}
                                minimumValue={1}
                                maximumValue={100}
                                step={1}
                                value={price}
                                onValueChange={(v: number | number[]) => setPrice(Array.isArray(v) ? v[0] : v)}
                                minimumTrackTintColor="#E95322"
                                maximumTrackTintColor="#E5E7EB"
                                thumbTintColor="#E95322"
                            />
                            <View className="flex-row justify-between -mt-1">
                                <Text className="text-[#6B7280] font-semibold">$1</Text>
                                <Text className="text-[#6B7280] font-semibold">$10</Text>
                                <Text className="text-[#6B7280] font-semibold">$50</Text>
                                <Text className="text-[#6B7280] font-semibold">$100 &gt;</Text>
                            </View>
                        </View>
                    </View>

                        <TouchableOpacity
                            className="bg-[#E95322] rounded-full items-center mt-16 mb-2 self-center px-20 py-3"
                            activeOpacity={0.8}
                            onPress={handleApplyFilters}
                        >
                            <Text className="text-white text-lg font-semibold">Apply Filters</Text>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            </View>
        </View>
    );
};

export default Filter;
