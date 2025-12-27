import Header from "@/components/common/Header";
import { Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import userService from "@/services/api/user.service";
import { FavoriteRestaurant } from "@/types/api/user";
import { showErrorAlert } from "@/utils/error-handler";

const FavoritesScreen = () => {
    const router = useRouter();
    const [favorites, setFavorites] = useState<FavoriteRestaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchFavorites = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const response = await userService.getFavorites();

            if (Array.isArray(response)) {
                setFavorites(response);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Favorites');
            setFavorites([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleToggleLike = async (restaurantId: string) => {
        const updatedFavorites = favorites.filter(fav => fav.restaurant_id !== restaurantId);
        setFavorites(updatedFavorites);

        try {
            await userService.removeFavorite(restaurantId);
        } catch (error) {
            fetchFavorites();
            showErrorAlert(error, 'Failed to Remove Favorite');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Favorites" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <Text className="text-xl font-medium text-orange-600 text-center mb-6">
                    {"It's time to order from your favorite restaurants."}
                </Text>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading favorites...</Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchFavorites(true)}
                                tintColor="#E95322"
                            />
                        }
                    >
                        {favorites.length === 0 ? (
                            <View className="items-center py-20">
                                <Heart size={80} color="#E95322" />
                                <Text className="text-xl font-medium text-gray-600 mt-6">No favorite restaurants yet</Text>
                                <Text className="text-gray-500 text-center mt-2 px-8">
                                    Explore and tap the heart to save your favorites!
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/(main)/(tabs)/Home')}
                                    className="mt-6 px-8 py-3 rounded-full bg-[#E95322]"
                                >
                                    <Text className="text-white font-semibold">Explore Restaurants</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="flex-row flex-wrap justify-between">
                                {favorites.map((favorite) => {
                                    if (!favorite) return null;

                                    const restaurant = favorite.restaurant || {};
                                    const restaurantName = restaurant.name || 'Restaurant';
                                    const minOrderAmount = Number(restaurant.min_order_amount) || 0;
                                    const logoUrl = restaurant.logo_url;

                                    return (
                                        <TouchableOpacity
                                            key={favorite.id}
                                            className="w-[48%] mb-7 relative"
                                            activeOpacity={0.9}
                                            onPress={() => router.push({
                                                pathname: "/restaurant/[id]",
                                                params: { id: favorite.restaurant_id }
                                            })}
                                        >
                                            <View className="relative">
                                                {logoUrl ? (
                                                    <Image source={{ uri: logoUrl }} className="w-full h-36 rounded-2xl" resizeMode="cover" />
                                                ) : (
                                                    <View className="w-full h-36 bg-gray-200 rounded-2xl" />
                                                )}
                                                <TouchableOpacity
                                                    onPress={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleLike(favorite.restaurant_id);
                                                    }}
                                                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow-md"
                                                >
                                                    <Heart size={22} color="#E95322" fill="#E95322" />
                                                </TouchableOpacity>
                                            </View>

                                            <View className="mt-3">
                                                <Text className="font-bold text-sm text-orange-600 leading-5" numberOfLines={2}>
                                                    {restaurantName}
                                                </Text>
                                                {minOrderAmount > 0 ? (
                                                    <Text className="text-orange-600 font-bold text-base mt-1">
                                                        ${minOrderAmount} min
                                                    </Text>
                                                ) : (
                                                    <Text className="text-gray-500 font-semibold text-sm mt-1">
                                                        No minimum order
                                                    </Text>
                                                )}
                                                <Text className="text-gray-500 text-xs mt-1 leading-4" numberOfLines={2}>
                                                    {restaurant.description || 'Your favorite restaurant'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default FavoritesScreen;
