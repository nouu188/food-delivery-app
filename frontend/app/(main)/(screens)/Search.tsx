import { Star } from "@tamagui/lucide-icons";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    View,
    TouchableOpacity,
} from "react-native";
import { SearchBar } from "@/components/common";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatRating } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export default function SearchScreen() {
    const router = useRouter();
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

    const setFavoriteRestaurantIds = useFavoritesStore((s) => s.setFavoriteRestaurantIds);

    const categoryParam = params.category;
    const minRatingParam = params.minRating;
    const maxPriceParam = params.maxPrice;

    const [filterCategory, setFilterCategory] = useState<string | undefined>(categoryParam);
    const [filterMinRating, setFilterMinRating] = useState<number | undefined>(
        minRatingParam ? parseInt(minRatingParam) : undefined
    );
    const [filterMaxPrice, setFilterMaxPrice] = useState<number | undefined>(
        maxPriceParam ? parseInt(maxPriceParam) : undefined
    );

    useEffect(() => {
        setFilterCategory(categoryParam);
    }, [categoryParam]);

    useEffect(() => {
        setFilterMinRating(minRatingParam ? parseInt(minRatingParam) : undefined);
    }, [minRatingParam]);

    useEffect(() => {
        setFilterMaxPrice(maxPriceParam ? parseInt(maxPriceParam) : undefined);
    }, [maxPriceParam]);

    const fetchRestaurants = useCallback(
        async (searchQuery: string, showRefreshIndicator = false) => {
            const hasQuery = searchQuery.trim().length > 0;
            const hasFilters =
                filterCategory || (filterMinRating && filterMinRating > 0) || (filterMaxPrice && filterMaxPrice < 100);

            if (!hasQuery && !hasFilters) {
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
                    restaurantService
                        .searchRestaurants({
                            search: searchQuery.trim() || undefined,
                            category_id: filterCategory,
                            page: 1,
                            limit: 50,
                        })
                        .catch(() => null),
                    userService.getFavorites().catch(() => null),
                ]);

                let filteredRestaurants: Restaurant[] = [];
                if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                    filteredRestaurants = restaurantsData.data;

                    if (filterMinRating && filterMinRating > 0) {
                        filteredRestaurants = filteredRestaurants.filter(
                            (r) => Number(r.average_rating) >= filterMinRating
                        );
                    }

                    if (filterMaxPrice && filterMaxPrice > 1) {
                        filteredRestaurants = filteredRestaurants.filter(
                            (r) => Number(r.min_order_amount) <= filterMaxPrice
                        );
                    }
                }

                setRestaurants(filteredRestaurants);

                if (favoritesData && Array.isArray(favoritesData)) {
                    const ids = favoritesData.map((f) => f.restaurant_id);
                    setFavorites(new Set(ids));
                    setFavoriteRestaurantIds(ids);
                } else {
                    setFavorites(new Set());
                    setFavoriteRestaurantIds([]);
                }

                setHasSearched(true);
            } catch (error) {
                showErrorAlert(error, "Failed to Search Restaurants");
                setRestaurants([]);
                setFavorites(new Set());
                setFavoriteRestaurantIds([]);
                setHasSearched(true);
            } finally {
                setIsLoading(false);
                setIsRefreshing(false);
            }
        },
        [filterCategory, filterMinRating, filterMaxPrice, setFavoriteRestaurantIds]
    );

    useEffect(() => {
        const hasFilters =
            filterCategory || (filterMinRating && filterMinRating > 0) || (filterMaxPrice && filterMaxPrice < 100);
        if (hasFilters && !query) {
            fetchRestaurants(query);
            return;
        }

        const debounceTimer = setTimeout(() => {
            fetchRestaurants(query);
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [query, fetchRestaurants]);

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
                                        {formatRating(item.average_rating)}
                                    </Text>
                                </View>
                            )}

                            {item.is_open !== undefined && (
                                <View
                                    className={`absolute left-3 top-3 px-3 py-1 rounded-full ${
                                        item.is_open ? "bg-green-500" : "bg-red-500"
                                    }`}
                                >
                                    <Text className="text-white text-xs font-semibold">
                                        {item.is_open ? "OPEN" : "CLOSED"}
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
            <View className="flex flex-row px-5 pt-16 pb-6">
                <View className="flex items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        className="mr-3 w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                        <Ionicons name="chevron-back-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
                <View className="flex-1">
                    <SearchBar
                        isSearchPage={true}
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search restaurants or food..."
                    />
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-6">
                <View className="px-5 mb-4">
                    {query.trim() && (
                        <Text className="text-[#6B7280] text-sm mb-2">
                            Search Result For: <Text className="text-[#E95322] font-semibold">{query}</Text>
                        </Text>
                    )}
                    {(filterCategory || filterMinRating || filterMaxPrice) && (
                        <View className="flex-row flex-wrap gap-2 mt-2">
                            {filterCategory && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">Category Filter</Text>
                                </View>
                            )}
                            {filterMinRating && filterMinRating > 0 && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">
                                        {filterMinRating}+ Stars
                                    </Text>
                                </View>
                            )}
                            {filterMaxPrice && filterMaxPrice > 1 && (
                                <View className="bg-[#FFE3D6] px-3 py-1 rounded-full">
                                    <Text className="text-[#E95322] text-xs font-semibold">Max ${filterMaxPrice}</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Searching...</Text>
                    </View>
                ) : !hasSearched ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-xl font-medium text-gray-600 text-center">
                            Search for your favorite food or restaurants
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Enter restaurant or food name above
                        </Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-xl font-medium text-gray-600 text-center">No restaurants found</Text>
                        <Text className="text-gray-500 text-center mt-2">Try searching with different keywords</Text>
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
