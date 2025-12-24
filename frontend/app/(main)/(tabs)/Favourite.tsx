import { FavoriteItem } from "@/components/common/favourites/FavoriteItem";
import Header from "@/components/common/Header";
import { Heart } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
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

            if (response?.items && Array.isArray(response.items)) {
                setFavorites(response.items);
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

    const handleNavigateToRestaurant = (restaurantId: string) => {
        router.push(`/restaurant/${restaurantId}`);
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
                                {favorites.map((favorite) => (
                                    <FavoriteItem
                                        key={favorite.id}
                                        id={favorite.restaurant_id}
                                        name={favorite.restaurant.name}
                                        price={0} 
                                        image={favorite.restaurant.logo_url ? { uri: favorite.restaurant.logo_url } : null}
                                        liked={true}
                                        onToggleLike={() => handleToggleLike(favorite.restaurant_id)}
                                    />
                                ))}
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default FavoritesScreen;
