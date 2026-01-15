import { BestSellerItem } from '@/components/common/bestSeller/BestSellerItem';
import Header from '@/components/common/Header';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import restaurantService from '@/services/api/restaurant.service';
import userService from '@/services/api/user.service';
import { Restaurant, RestaurantCategory } from '@/types/api/restaurant';
import { showErrorAlert } from '@/utils/error-handler';
import FloatingCartButton from '@/components/common/restaurant/FloatingCartButton';
import { CartSidebar } from '@/components/common/cart';
import { useCartStore } from '@/store/useCartStore';
import { Star, TrendingUp, Filter, ChevronDown, X } from 'lucide-react-native';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const BestSellerScreen = () => {
    const router = useRouter();
    const { openDrawer } = useCartStore();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [sortBy, setSortBy] = useState<'rating' | 'popular'>('rating');

    const setFavoriteRestaurantIds = useFavoritesStore((s) => s.setFavoriteRestaurantIds);
    const addFavoriteRestaurantId = useFavoritesStore((s) => s.addFavoriteRestaurantId);
    const removeFavoriteRestaurantId = useFavoritesStore((s) => s.removeFavoriteRestaurantId);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Filters
    const [showFilters, setShowFilters] = useState(false);
    const [categories, setCategories] = useState<RestaurantCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [minRating, setMinRating] = useState<number>(0);
    const [maxPrice, setMaxPrice] = useState<number>(100);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const count = (selectedCategory ? 1 : 0) + (minRating > 0 ? 1 : 0) + (maxPrice < 100 ? 1 : 0);
        setActiveFiltersCount(count);
    }, [selectedCategory, minRating, maxPrice]);

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

    const fetchBestSellers = async (
        page = 1,
        showRefreshIndicator = false,
        sortOption = sortBy,
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
                    sort_by: sortOption,
                    category_id: selectedCategory,
                }).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                // Apply client-side filters for rating and price
                let filteredData = restaurantsData.data;

                if (minRating > 0) {
                    filteredData = filteredData.filter(
                        r => Number(r.average_rating) >= minRating
                    );
                }

                if (maxPrice < 100) {
                    filteredData = filteredData.filter(
                        r => Number(r.min_order_amount) <= maxPrice
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
                const ids = favoritesData.map((f) => f.restaurant_id);
                setFavorites(new Set(ids));
                setFavoriteRestaurantIds(ids);
            } else {
                setFavorites(new Set());
                setFavoriteRestaurantIds([]);
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Best Sellers');
            if (!append) {
                setRestaurants([]);
                setFavorites(new Set());
            }
            setFavoriteRestaurantIds([]);
            setHasMore(false);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
            setIsLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!isLoadingMore && !isLoading && hasMore) {
            fetchBestSellers(currentPage + 1, false, sortBy, true);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setHasMore(true);
        fetchBestSellers(1, false, sortBy);
    }, [sortBy, selectedCategory, minRating, maxPrice]);

    const handleApplyFilters = () => {
        setShowFilters(false);
        setCurrentPage(1);
        setHasMore(true);
        fetchBestSellers(1, false, sortBy);
    };

    const handleClearFilters = () => {
        setSelectedCategory(undefined);
        setMinRating(0);
        setMaxPrice(100);
    };

    const handleCategoryToggle = (categoryId: string) => {
        setSelectedCategory(prev => prev === categoryId ? undefined : categoryId);
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

        if (wasFavorite) {
            removeFavoriteRestaurantId(restaurantId);
        } else {
            addFavoriteRestaurantId(restaurantId);
        }

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

            if (wasFavorite) {
                addFavoriteRestaurantId(restaurantId);
            } else {
                removeFavoriteRestaurantId(restaurantId);
            }
            showErrorAlert(error, 'Failed to Update Favorite');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Best Sellers" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6" style={{ position: 'relative' }}>
                <View className="mb-4">
                    <View className="flex-row items-center mb-2">
                        <TrendingUp size={24} color="#E95322" />
                        <Text className="text-xl font-bold text-[#391713] ml-2">Top Rated Restaurants</Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                        Discover our most popular restaurants with highest ratings
                    </Text>
                </View>

                <View className="flex-row gap-2 mb-4">
                    <TouchableOpacity
                        onPress={() => setSortBy('rating')}
                        activeOpacity={0.8}
                        className={`flex-1 flex-row items-center justify-center py-3 rounded-full ${
                            sortBy === 'rating' ? 'bg-[#E95322]' : 'bg-[#FFE3D6]'
                        }`}
                        style={{
                            shadowColor: sortBy === 'rating' ? '#E95322' : '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: sortBy === 'rating' ? 0.3 : 0.1,
                            shadowRadius: 4,
                            elevation: sortBy === 'rating' ? 4 : 2,
                        }}
                    >
                        <Star size={16} color={sortBy === 'rating' ? '#FFFFFF' : '#E95322'} fill={sortBy === 'rating' ? '#FFFFFF' : '#E95322'} />
                        <Text className={`ml-2 font-semibold ${sortBy === 'rating' ? 'text-white' : 'text-[#E95322]'}`}>
                            Top Rated
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSortBy('popular')}
                        activeOpacity={0.8}
                        className={`flex-1 flex-row items-center justify-center py-3 rounded-full ${
                            sortBy === 'popular' ? 'bg-[#E95322]' : 'bg-[#FFE3D6]'
                        }`}
                        style={{
                            shadowColor: sortBy === 'popular' ? '#E95322' : '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: sortBy === 'popular' ? 0.3 : 0.1,
                            shadowRadius: 4,
                            elevation: sortBy === 'popular' ? 4 : 2,
                        }}
                    >
                        <TrendingUp size={16} color={sortBy === 'popular' ? '#FFFFFF' : '#E95322'} />
                        <Text className={`ml-2 font-semibold ${sortBy === 'popular' ? 'text-white' : 'text-[#E95322]'}`}>
                            Most Popular
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setShowFilters(!showFilters)}
                        activeOpacity={0.8}
                        className="w-12 items-center justify-center rounded-full bg-[#FFE3D6]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 2,
                        }}
                    >
                        <View>
                            <Filter size={20} color="#E95322" />
                            {activeFiltersCount > 0 && (
                                <View className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E95322] items-center justify-center">
                                    <Text className="text-white text-[10px] font-bold">{activeFiltersCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>

                {showFilters && (
                    <View className="mb-4 p-4 bg-[#FFF5E6] rounded-2xl">
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

                        <View className="mb-4">
                            <Text className="text-sm font-bold text-[#391713] mb-2">Max Order Amount</Text>
                            <View className="flex-row gap-2">
                                {[25, 50, 75, 100].map((price) => (
                                    <TouchableOpacity
                                        key={price}
                                        onPress={() => setMaxPrice(price)}
                                        activeOpacity={0.8}
                                        className={`flex-1 items-center justify-center py-2 rounded-full ${
                                            maxPrice === price ? 'bg-[#E95322]' : 'bg-white'
                                        }`}
                                    >
                                        <Text className={`text-xs font-semibold ${
                                            maxPrice === price ? 'text-white' : 'text-[#E95322]'
                                        }`}>
                                            {price >= 100 ? 'All' : `$${price}`}
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
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-gray-500 text-sm">
                            {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
                        </Text>
                        <Text className="text-gray-500 text-xs">
                            Page {currentPage} of {totalPages}
                        </Text>
                    </View>
                )}

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading best sellers...</Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-20 h-20 rounded-full bg-[#FFE3D6] items-center justify-center mb-4">
                            <Star size={40} color="#E95322" />
                        </View>
                        <Text className="text-xl font-bold text-gray-600">No restaurants available</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            {activeFiltersCount > 0 ? 'Try adjusting your filters' : 'Check back later for our best sellers'}
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
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        renderItem={({ item }) => (
                            <BestSellerItem
                                id={item.id}
                                name={item.name}
                                price={item.min_order_amount}
                                rating={item.average_rating}
                                image={item.logo_url ? { uri: item.logo_url } : null}
                                liked={favorites.has(item.id)}
                                onToggleLike={() => handleToggleLike(item.id)}
                                description={item.description}
                                isOpen={item.is_open}
                            />
                        )}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => {
                                    setCurrentPage(1);
                                    setHasMore(true);
                                    fetchBestSellers(1, true, sortBy);
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
        </SafeAreaView>
    );
};

export default BestSellerScreen;