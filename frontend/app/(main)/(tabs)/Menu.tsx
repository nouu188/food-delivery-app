import { Categories, SearchNav } from "@/components/common";
import NotificationSidebar from "@/components/common/notification/NotificationSidebar";
import ProfileSidebar from "@/components/common/profile/ProfileSidebar";
import { ChevronDown, Star } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";

export default function MenuScreen() {
    const [sortBy, setSortBy] = useState<"popular" | "rating" | "name">("popular");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isNotificationVisible, setIsNotificationVisible] = useState(false);
    const [isProfileVisible, setIsProfileVisible] = useState(false);

    const fetchRestaurants = async (pageNum = 1, showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else if (pageNum === 1) {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService.getRestaurants({
                    page: pageNum,
                    limit: 10,
                    sort_by: sortBy,
                }),
                userService.getFavorites().catch(() => ({ items: [] })),
            ]);

            if (pageNum === 1) {
                setRestaurants(restaurantsData.items);
            } else {
                setRestaurants(prev => [...prev, ...restaurantsData.items]);
            }

            setFavorites(new Set(favoritesData.items.map(f => f.restaurant_id)));
            setHasMore(restaurantsData.meta.has_next_page);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Restaurants');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        setPage(1);
        fetchRestaurants(1);
    }, [sortBy]);

    const loadMore = () => {
        if (hasMore && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchRestaurants(nextPage);
        }
    };

    const toggleFavorite = async (restaurantId: string) => {
        const wasFavorite = favorites.has(restaurantId);
        setFavorites(prev => {
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
            setFavorites(prev => {
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
                            {item.address && (
                                <Text numberOfLines={2} className="text-[#9CA3AF] text-xs mt-1 leading-4">
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
            {/* Header + Search + Categories */}
            <View className="bg-[#F9CF63] pt-14 pb-2">
                <View className="px-5">
                    <SearchNav
                        onNotificationPress={() => setIsNotificationVisible(true)}
                        onProfilePress={() => setIsProfileVisible(true)}
                    />
                </View>

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

            <View
                className="flex-1 pt-3"
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
                            setSortBy(sortBy === "popular" ? "rating" : sortBy === "rating" ? "name" : "popular")
                        }
                    >
                        <Text className="text-[#070707] font-semibold text-sm mr-1">
                            Sort By{" "}
                            <Text className="text-[#E95322]">
                                {sortBy === "popular" ? "Popular" : sortBy === "rating" ? "Rating" : "Name"}
                            </Text>
                        </Text>
                        <ChevronDown size={16} color="#F15A24" />
                    </TouchableOpacity>
                </View>

                {/* Danh sách kết quả */}
                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading restaurants...</Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="items-center py-20">
                        <Text className="text-xl font-medium text-gray-600">No restaurants found</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            Try adjusting your filters or check back later
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                        onEndReached={loadMore}
                        onEndReachedThreshold={0.5}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchRestaurants(1, true)}
                                tintColor="#E95322"
                            />
                        }
                        ListFooterComponent={
                            hasMore && !isLoading ? (
                                <View className="py-4 items-center">
                                    <ActivityIndicator size="small" color="#E95322" />
                                </View>
                            ) : null
                        }
                    />
                )}
            </View>

            <NotificationSidebar isVisible={isNotificationVisible} onClose={() => setIsNotificationVisible(false)} />
            <ProfileSidebar isVisible={isProfileVisible} onClose={() => setIsProfileVisible(false)} />
        </View>
    );
}
