import { Star } from "@tamagui/lucide-icons";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, View } from "react-native";
import { SearchBar } from "@/components/common";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";

export default function SearchScreen() {
    const params = useLocalSearchParams<{
        category?: string;
        minRating?: string;
        maxPrice?: string;
    }>();

    const [query, setQuery] = useState("");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<{
        category?: string;
        minRating?: number;
        maxPrice?: number;
    }>({});

    useEffect(() => {
        if (params.category || params.minRating || params.maxPrice) {
            setAppliedFilters({
                category: params.category,
                minRating: params.minRating ? parseInt(params.minRating) : undefined,
                maxPrice: params.maxPrice ? parseInt(params.maxPrice) : undefined,
            });
        }
    }, [params]);

    const fetchRestaurants = async (searchQuery: string, showRefreshIndicator = false) => {
        if (!searchQuery.trim() && !appliedFilters.category) {
            setRestaurants([]);
            setHasSearched(false);
            return;
        }

        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService.searchRestaurants({
                    search: searchQuery.trim() || undefined,
                    category: appliedFilters.category,
                    page: 1,
                    limit: 50,
                }).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            // Safely handle restaurant search results
            let filteredRestaurants: Restaurant[] = [];
            if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                filteredRestaurants = restaurantsData.data;

                // Apply additional filters
                if (appliedFilters.minRating && appliedFilters.minRating > 0) {
                    filteredRestaurants = filteredRestaurants.filter(
                        r => r.average_rating >= appliedFilters.minRating!
                    );
                }

                if (appliedFilters.maxPrice && appliedFilters.maxPrice > 1) {
                    filteredRestaurants = filteredRestaurants.filter(
                        r => r.min_order_amount <= appliedFilters.maxPrice!
                    );
                }
            }

            setRestaurants(filteredRestaurants);

            // Safely handle favorites data
            if (favoritesData?.items && Array.isArray(favoritesData.items)) {
                setFavorites(new Set(favoritesData.items.map(f => f.restaurant_id)));
            } else {
                setFavorites(new Set());
            }

            setHasSearched(true);
        } catch (error) {
            showErrorAlert(error, 'Failed to Search Restaurants');
            setRestaurants([]);
            setFavorites(new Set());
            setHasSearched(true);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchRestaurants(query);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query, appliedFilters]);

    const renderItem = ({ item }: { item: Restaurant }) => {
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
                <Link href={{ pathname: "/restaurant/[id]", params: { id: item.id } }} asChild>
                    <Pressable>
                        <View className="relative">
                            {item.logo_url ? (
                                <Image source={{ uri: item.logo_url }} className="w-full h-52" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-52 bg-gray-200 items-center justify-center">
                                    <Text className="text-gray-500">No Image</Text>
                                </View>
                            )}

                            {item.average_rating && (
                                <View className="absolute right-3 top-3 bg-white/90 rounded-full px-2 py-1 flex-row items-center">
                                    <Star size={12} color="#F15A24" fill="#F15A24" />
                                    <Text className="text-[#F15A24] text-xs font-bold ml-1">
                                        {item.average_rating.toFixed(1)}
                                    </Text>
                                </View>
                            )}

                            {item.is_open !== undefined && (
                                <View className={`absolute left-3 top-3 px-3 py-1 rounded-full ${
                                    item.is_open ? 'bg-green-500' : 'bg-red-500'
                                }`}>
                                    <Text className="text-white text-xs font-semibold">
                                        {item.is_open ? 'OPEN' : 'CLOSED'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="px-4 py-3">
                            <Text numberOfLines={1} className="text-[#391713] text-lg font-bold leading-5">
                                {item.name}
                            </Text>
                            {item.description && (
                                <Text numberOfLines={2} className="text-[#9CA3AF] text-sm mt-1 leading-4">
                                    {item.description}
                                </Text>
                            )}
                            {item.address && (
                                <Text numberOfLines={1} className="text-[#9CA3AF] text-xs mt-1">
                                    {item.address}
                                </Text>
                            )}
                        </View>
                    </Pressable>
                </Link>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-5 pt-16 pb-8">
                <SearchBar
                    isSearchPage={true}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search restaurants..."
                />
            </View>

            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-6">
                <View className="px-5 mb-4">
                    {query.trim() && (
                        <Text className="text-[#6B7280] text-sm mb-2">
                            Search Result For: <Text className="text-[#E95322] font-semibold">{query}</Text>
                        </Text>
                    )}
                    {(appliedFilters.category || appliedFilters.minRating || appliedFilters.maxPrice) && (
                        <View className="flex-row flex-wrap gap-2 mt-2">
                            {appliedFilters.category && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">
                                        Category Filter
                                    </Text>
                                </View>
                            )}
                            {appliedFilters.minRating && appliedFilters.minRating > 0 && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">
                                        {appliedFilters.minRating}+ Stars
                                    </Text>
                                </View>
                            )}
                            {appliedFilters.maxPrice && appliedFilters.maxPrice > 1 && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">
                                        Max ${appliedFilters.maxPrice}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Searching restaurants...</Text>
                    </View>
                ) : !hasSearched ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-xl font-medium text-gray-600 text-center">
                            Search for your favorite restaurants
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Enter restaurant name or cuisine type above
                        </Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-xl font-medium text-gray-600 text-center">
                            No restaurants found
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Try searching with different keywords
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 70 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchRestaurants(query, true)}
                                tintColor="#E95322"
                            />
                        }
                    />
                )}
            </View>
        </View>
    );
}
