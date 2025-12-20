import { Star } from "@tamagui/lucide-icons";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";

export default function RecommendScreen() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchRecommendations = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService.getRestaurants({
                    limit: 50,
                    sort_by: 'popular',
                }),
                userService.getFavorites().catch(() => ({ items: [] })),
            ]);

            setRestaurants(restaurantsData.items);
            setFavorites(new Set(favoritesData.items.map(f => f.restaurant_id)));
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Recommendations');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const renderItem = ({ item }: { item: Restaurant }) => {
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
                onPress={() => router.push(`/restaurant/${item.id}`)}
            >
                <View className="relative">
                    {item.logo_url ? (
                        <Image source={{ uri: item.logo_url }} className="w-full h-52" resizeMode="cover" />
                    ) : (
                        <View className="w-full h-52 bg-gray-200 items-center justify-center">
                            <Text className="text-gray-500">No Image</Text>
                        </View>
                    )}

                    {item.average_rating > 0 && (
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
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-5 pt-16 pb-8">
                <View className="flex-row items-center justify-between">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                    >
                        <Ionicons name="chevron-back" size={24} color="#914025" />
                    </Pressable>
                    <Text className="text-[#914025] text-xl font-bold">Recommendations</Text>
                    <View className="w-10" />
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl -mt-2 -mb-20 pt-6">
                <Text className="text-[#E95322] text-lg font-semibold text-center px-5 mb-4">
                    Discover our most{"\n"}popular restaurants.
                </Text>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading recommendations...</Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text className="text-xl font-medium text-gray-600 text-center">
                            No recommendations available
                        </Text>
                        <Text className="text-gray-500 text-center mt-2">
                            Check back later for our top picks
                        </Text>
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
                                onRefresh={() => fetchRecommendations(true)}
                                tintColor="#E95322"
                            />
                        }
                    />
                )}
            </View>
        </View>
    );
}
