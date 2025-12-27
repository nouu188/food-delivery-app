import { BestSellerItem } from '@/components/common/bestSeller/BestSellerItem';
import Header from '@/components/common/Header';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import restaurantService from '@/services/api/restaurant.service';
import userService from '@/services/api/user.service';
import { Restaurant } from '@/types/api/restaurant';
import { showErrorAlert } from '@/utils/error-handler';

const BestSellerScreen = () => {
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchBestSellers = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService.getRestaurants({
                    limit: 50,
                    sort_by: 'rating',
                }).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                setRestaurants(restaurantsData.data);
            } else {
                setRestaurants([]);
            }

            if (favoritesData && Array.isArray(favoritesData)) {
                setFavorites(new Set(favoritesData.map(f => f.restaurant_id)));
            } else {
                setFavorites(new Set());
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Best Sellers');
            setRestaurants([]);
            setFavorites(new Set());
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBestSellers();
    }, []);

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

    const handlePress = (restaurantId: string) => {
        router.push({
            pathname: "/restaurant/[id]",
            params: { id: restaurantId },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Best Seller" />

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-6">
                <Text className="text-gray-600 text-center mb-6">Discover our most popular restaurants!</Text>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading best sellers...</Text>
                    </View>
                ) : restaurants.length === 0 ? (
                    <View className="flex-1 items-center justify-center">
                        <Text className="text-xl font-medium text-gray-600">No restaurants available</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            Check back later for our best sellers
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchBestSellers(true)}
                                tintColor="#E95322"
                            />
                        }
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {restaurants.map((restaurant) => (
                                <BestSellerItem
                                    key={restaurant.id}
                                    id={restaurant.id}
                                    name={restaurant.name}
                                    price={restaurant.min_order_amount}
                                    rating={restaurant.average_rating}
                                    image={restaurant.logo_url ? { uri: restaurant.logo_url } : null}
                                    liked={favorites.has(restaurant.id)}
                                    onToggleLike={() => handleToggleLike(restaurant.id)}
                                />
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

export default BestSellerScreen;