import { Star, Heart, TrendingUp, Filter, Sparkles } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View, ScrollView } from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant, RestaurantCategory } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatRating, parseNumeric } from "@/utils/format";
import FloatingCartButton from "@/components/common/restaurant/FloatingCartButton";
import { CartSidebar } from "@/components/common/cart";
import { useCartStore } from "@/store/useCartStore";

export default function RecommendScreen() {
    const { openDrawer } = useCartStore();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState<RestaurantCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [minRating, setMinRating] = useState<number>(0);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const count = (selectedCategory ? 1 : 0) + (minRating > 0 ? 1 : 0);
        setActiveFiltersCount(count);
    }, [selectedCategory, minRating]);

    useEffect(() => {
        setCurrentPage(1);
        setHasMore(true);
        fetchRecommendations(1, false);
    }, [selectedCategory, minRating]);

    const fetchCategories = async () => {
        try {
            const categoriesData = await restaurantService.getCategories();
            if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error('Failed to load categories:', error);
        }
    };

    const fetchRecommendations = async (
        page = 1,
        showRefreshIndicator = false,
        append = false
    ) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else if (append) {
                setIsLoadingMore(true);
            } else {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService.getRestaurants({
                    page,
                    limit: 20,
                    sort_by: 'popular',
                    category_id: selectedCategory,
                }).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                // Apply client-side filter for rating
                let filteredData = restaurantsData.data;

                if (minRating > 0) {
                    filteredData = filteredData.filter(
                        r => Number(r.average_rating) >= minRating
                    );
                }

                if (append) {
                    setRestaurants(prev => [...prev, ...filteredData]);
                } else {
                    setRestaurants(filteredData);
                }

                setTotalPages(restaurantsData.total_pages || 1);
                setHasMore(page < (restaurantsData.total_pages || 1));
                setCurrentPage(page);
            } else {
                if (!append) {
                    setRestaurants([]);
                }
                setHasMore(false);
            }

            if (favoritesData && Array.isArray(favoritesData)) {
                setFavorites(new Set(favoritesData.map(f => f.restaurant_id)));
            } else {
                setFavorites(new Set());
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Recommendations');
            if (!append) {
                setRestaurants([]);
                setFavorites(new Set());
            }
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!isLoadingMore && !isLoading && hasMore) {
            fetchRecommendations(currentPage + 1, false, true);
        }
    };

    const handleToggleLike = async (restaurantId: string) => {
        const wasFavorite = favorites.has(restaurantId);

        setFavorites((prev) => {
            const newSet = new Set(prev);
            if (wasFavorite) {
                newSet.delete(restaurantId);
            } else {
                newSet.add(restaurantId);
            }
            return newSet;
        });

        try {
            if (wasFavorite) {
                await userService.removeFavorite(restaurantId);
            } else {
                await userService.addFavorite(restaurantId);
            }
        } catch (error) {
            setFavorites((prev) => {
                const newSet = new Set(prev);
                if (wasFavorite) {
                    newSet.add(restaurantId);
                } else {
                    newSet.delete(restaurantId);
                }
                return newSet;
            });
            showErrorAlert(error, 'Failed to Update Favorite');
        }
    };

    const handleApplyFilters = () => {
        setShowFilters(false);
        setCurrentPage(1);
        setHasMore(true);
        fetchRecommendations(1, false);
    };

    const handleClearFilters = () => {
        setSelectedCategory(undefined);
        setMinRating(0);
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategory(prev => prev === categoryId ? undefined : categoryId);
    };

    const renderItem = ({ item }: { item: Restaurant }) => {
        const isFavorite = favorites.has(item.id);
        return (
            <Pressable
                className="bg-white rounded-3xl mb-4 overflow-hidden"
                style={{
                    elevation: 3,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 8,
                }}
                onPress={() => router.push({
                    pathname: "/restaurant/[id]",
                    params: { id: item.id },
                })}
            >
                <View className="relative">
                    {item.logo_url ? (
                        <Image source={{ uri: item.logo_url }} className="w-full h-52" resizeMode="cover" />
                    ) : (
                        <View className="w-full h-52 bg-gray-200 items-center justify-center">
                            <TrendingUp size={48} color="#9CA3AF" />
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={(e) => {
                            e.stopPropagation();
                            handleToggleLike(item.id);
                        }}
                        className="absolute right-3 top-3 bg-white/90 rounded-full p-2 shadow-md"
                        activeOpacity={0.8}
                    >
                        <Heart
                            size={20}
                            color="#E95322"
                            fill={isFavorite ? '#E95322' : 'transparent'}
                            strokeWidth={2.5}
                        />
                    </TouchableOpacity>

                    {parseNumeric(item.average_rating) > 0 && (
                        <View className="absolute right-3 bottom-3 bg-white/90 rounded-full px-3 py-1 flex-row items-center shadow-md">
                            <Star size={12} color="#F15A24" fill="#F15A24" />
                            <Text className="text-[#F15A24] text-xs font-bold ml-1">
                                {formatRating(item.average_rating)}
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
                    <View className="flex-row items-center justify-between mt-2">
                        {item.address && (
                            <Text numberOfLines={1} className="text-[#9CA3AF] text-xs flex-1">
                                {item.address}
                            </Text>
                        )}
                        {item.min_order_amount && (
                            <Text className="text-[#E95322] text-sm font-bold ml-2">
                                Min ${Number(item.min_order_amount).toFixed(2)}
                            </Text>
                        )}
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-5 pt-16 pb-6">
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                        <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View className="flex-row items-center">
                        <Sparkles size={24} color="#FFFFFF" />
                        <Text className="text-white text-xl font-bold ml-2">Recommendations</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        activeOpacity={0.8}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.3)" }}
                    >
                        <View>
                            <Filter size={20} color="#FFFFFF" />
                            {activeFiltersCount > 0 && (
                                <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E95322] items-center justify-center">
                                    <Text className="text-white text-[10px] font-bold">{activeFiltersCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl -mt-2 pt-6" style={{ position: 'relative' }}>
                <View className="px-5 mb-4">
                    <View className="flex-row items-center mb-2">
                        <TrendingUp size={20} color="#E95322" />
                        <Text className="text-[#E95322] text-base font-semibold ml-2">
                            Discover our most popular restaurants
                        </Text>
                    </View>

                    {showFilters && (
                        <View className="mt-3 p-4 bg-[#FFF5E6] rounded-2xl">
                            <View className="mb-4">
                                <Text className="text-sm font-bold text-[#391713] mb-2">Category</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-2">
                                        {categories.map((category) => (
                                            <TouchableOpacity
                                                key={category.id}
                                                onPress={() => handleCategoryToggle(category.id)}
                                                activeOpacity={0.8}
                                                className={`px-4 py-2 rounded-full ${
                                                    selectedCategory === category.id ? 'bg-[#E95322]' : 'bg-white'
                                                }`}
                                            >
                                                <Text className={`text-sm font-semibold ${
                                                    selectedCategory === category.id ? 'text-white' : 'text-[#E95322]'
                                                }`}>
                                                    {category.name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-bold text-[#391713] mb-2">Minimum Rating</Text>
                                <View className="flex-row gap-2">
                                    {[0, 3, 4, 5].map((rating) => (
                                        <TouchableOpacity
                                            key={rating}
                                            onPress={() => setMinRating(rating)}
                                            activeOpacity={0.8}
                                            className={`flex-1 flex-row items-center justify-center py-2 rounded-full ${
                                                minRating === rating ? 'bg-[#E95322]' : 'bg-white'
                                            }`}
                                        >
                                            <Star
                                                size={14}
                                                color={minRating === rating ? '#FFFFFF' : '#E95322'}
                                                fill={minRating === rating ? '#FFFFFF' : '#E95322'}
                                            />
                                            <Text className={`ml-1 text-xs font-semibold ${
                                                minRating === rating ? 'text-white' : 'text-[#E95322]'
                                            }`}>
                                                {rating === 0 ? 'All' : `${rating}+`}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View className="flex-row gap-2">
                                {activeFiltersCount > 0 && (
                                    <TouchableOpacity
                                        onPress={handleClearFilters}
                                        activeOpacity={0.8}
                                        className="flex-1 py-2 rounded-full bg-gray-200 items-center"
                                    >
                                        <Text className="text-[#391713] font-semibold text-sm">Clear</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    onPress={handleApplyFilters}
                                    activeOpacity={0.8}
                                    className={`${activeFiltersCount > 0 ? 'flex-1' : 'flex-1'} py-2 rounded-full bg-[#E95322] items-center`}
                                >
                                    <Text className="text-white font-semibold text-sm">Apply</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {!isLoading && restaurants.length > 0 && (
                        <View className="flex-row justify-between items-center mt-3">
                            <Text className="text-gray-500 text-sm">
                                {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
                            </Text>
                            <Text className="text-gray-500 text-xs">
                                Page {currentPage} of {totalPages}
                            </Text>
                        </View>
                    )}
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading recommendations...</Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <View className="w-20 h-20 rounded-full bg-[#FFE3D6] items-center justify-center mb-4">
                            <Sparkles size={40} color="#E95322" />
                        </View>
                        <Text className="text-xl font-medium text-gray-600 text-center">
                            No recommendations available
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'Check back later for our top picks'}
                        </Text>
                        {activeFiltersCount > 0 ? (
                            <TouchableOpacity
                                onPress={handleClearFilters}
                                className="mt-6 px-8 py-3 bg-[#E95322] rounded-full"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold">Clear Filters</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                onPress={() => router.push('/(main)/(tabs)/Home')}
                                className="mt-6 px-8 py-3 bg-[#E95322] rounded-full"
                                activeOpacity={0.8}
                            >
                                <Text className="text-white font-semibold">Explore Restaurants</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(it) => it.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    setCurrentPage(1);
                                    setHasMore(true);
                                    fetchRecommendations(1, true);
                                }}
                                tintColor="#E95322"
                            />
                        }
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={() => (
                            isLoadingMore ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator size="small" color="#E95322" />
                                    <Text className="text-gray-500 text-xs mt-2">Loading more...</Text>
                                </View>
                            ) : !hasMore && restaurants.length > 0 ? (
                                <View className="py-4 items-center">
                                    <Text className="text-gray-500 text-xs">No more restaurants</Text>
                                </View>
                            ) : null
                        )}
                    />
                )}

                <FloatingCartButton onPress={openDrawer} />
            </View>

            <CartSidebar />
        </View>
    );
}
