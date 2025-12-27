import Header from "@/components/common/Header";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, MapPin, Clock, Star, Plus, Minus, ShoppingCart } from "lucide-react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { useCartStore } from "@/store/useCartStore";
import { Restaurant, MenuItem } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatPrice, formatRating } from "@/utils/format";

export default function RestaurantDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    const { addToCart, clearCart } = useCartStore();

    const fetchData = async (showRefreshIndicator = false) => {
        if (!id) return;

        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [restaurantData, menuCategories, favoritesData] = await Promise.all([
                restaurantService.getRestaurantById(id).catch(() => null),
                restaurantService.getMenu(id).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            if (restaurantData) {
                setRestaurant(restaurantData);
            } else {
                showErrorAlert(new Error('Restaurant not found'), 'Failed to Load Restaurant');
                router.back();
                return;
            }

            const allMenuItems: MenuItem[] = [];
            if (menuCategories && Array.isArray(menuCategories)) {
                menuCategories.forEach(category => {
                    if (category?.items && Array.isArray(category.items)) {
                        allMenuItems.push(...category.items);
                    }
                });
            }
            setMenuItems(allMenuItems);

            if (favoritesData && Array.isArray(favoritesData)) {
                setIsFavorite(favoritesData.some(f => f.restaurant_id === id));
            } else {
                setIsFavorite(false);
            }

            const initialQuantities: { [key: string]: number } = {};
            allMenuItems.forEach((item: MenuItem) => {
                initialQuantities[item.id] = 0;
            });
            setQuantities(initialQuantities);
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Restaurant');
            router.back();
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const toggleFavorite = async () => {
        if (!id) return;

        const wasFavorite = isFavorite;
        setIsFavorite(!wasFavorite);

        try {
            if (wasFavorite) {
                await userService.removeFavorite(id);
            } else {
                await userService.addFavorite(id);
            }
        } catch (error) {
            setIsFavorite(wasFavorite);
            showErrorAlert(error, 'Failed to Update Favorite');
        }
    };

    const handleAddToCart = async (item: MenuItem, forceReplace = false) => {
        const quantity = quantities[item.id] || 1;

        if (quantity < 1) {
            Alert.alert("Invalid Quantity", "Please select at least 1 item");
            return;
        }

        setAddingToCart(item.id);
        let isConflictError = false;
        try {
            if (forceReplace) {
                await clearCart();
            }

            await addToCart({
                menu_item_id: item.id,
                quantity: quantity,
            });
            Alert.alert("Success", `${item.name} added to cart!`);
            setQuantities(prev => ({ ...prev, [item.id]: 0 }));
        } catch (error: any) {
            if (error.isConflict && error.response?.data) {
                isConflictError = true;
                const conflictData = error.response.data;
                const currentRestaurantName = conflictData.currentRestaurant?.name || 'another restaurant';
                const newRestaurantName = conflictData.newRestaurant?.name || 'this restaurant';

                Alert.alert(
                    'Replace Cart Items?',
                    `Your cart contains items from ${currentRestaurantName}. Do you want to clear your cart and add items from ${newRestaurantName} instead?`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => setAddingToCart(null),
                        },
                        {
                            text: 'Replace Cart',
                            style: 'destructive',
                            onPress: () => handleAddToCart(item, true),
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }
            showErrorAlert(error, 'Failed to Add to Cart');
        } finally {
            if (!isConflictError) {
                setAddingToCart(null);
            }
        }
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
        }));
    };

    if (isLoading) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Restaurant Details" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <ActivityIndicator size="large" color="#E95322" />
                    <Text className="text-gray-500 mt-4">Loading restaurant...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!restaurant) {
        return (
            <SafeAreaView className="flex-1 bg-YellowBase">
                <Header title="Restaurant Details" />
                <View className="flex-1 bg-white rounded-t-3xl items-center justify-center">
                    <Text className="text-gray-500">Restaurant not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header
                title={restaurant.name}
                rightComponent={
                    <TouchableOpacity onPress={toggleFavorite} className="p-2">
                        <Heart
                            size={24}
                            color="#E95322"
                            fill={isFavorite ? "#E95322" : "none"}
                            strokeWidth={2}
                        />
                    </TouchableOpacity>
                }
            />

            <View className="flex-1 bg-white rounded-t-3xl">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => fetchData(true)}
                            tintColor="#E95322"
                        />
                    }
                >
                    <View className="relative">
                        {restaurant.logo_url ? (
                            <Image
                                source={{ uri: restaurant.logo_url }}
                                className="w-full h-56"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-56 bg-gray-200 items-center justify-center">
                                <Text className="text-gray-500">No Image</Text>
                            </View>
                        )}

                        {restaurant.average_rating && (
                            <View className="absolute top-4 left-4 bg-white/95 px-3 py-2 rounded-full flex-row items-center shadow-md">
                                <Star size={16} color="#F4BA1B" fill="#F4BA1B" />
                                <Text className="text-sm font-bold ml-1">
                                    {formatRating(restaurant.average_rating)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="px-5 pt-5">
                        <Text className="text-2xl font-bold text-[#070707]">{restaurant.name}</Text>

                        {restaurant.address && (
                            <View className="flex-row items-center mt-3">
                                <MapPin size={16} color="#666" />
                                <Text className="text-gray-600 ml-2 flex-1">{restaurant.address}</Text>
                            </View>
                        )}

                        {restaurant.phone && (
                            <Text className="text-gray-600 mt-2">{restaurant.phone}</Text>
                        )}

                        {restaurant.is_open !== undefined && (
                            <View className="flex-row items-center mt-3">
                                <Clock size={16} color={restaurant.is_open ? "#10B981" : "#EF4444"} />
                                <Text className={`ml-2 font-semibold ${restaurant.is_open ? "text-green-600" : "text-red-600"}`}>
                                    {restaurant.is_open ? "Open Now" : "Closed"}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View className="px-5 pt-6 pb-20">
                        <Text className="text-xl font-bold text-[#070707] mb-4">Menu</Text>

                        {menuItems.length > 0 ? (
                            menuItems.map((item) => (
                                <View
                                    key={item.id}
                                    className="bg-white rounded-2xl mb-4 overflow-hidden border border-gray-100"
                                    style={{
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowRadius: 4,
                                        elevation: 2,
                                    }}
                                >
                                    <View className="flex-row p-4">
                                        <View className="mr-4">
                                            {item.image_url ? (
                                                <Image
                                                    source={{ uri: item.image_url }}
                                                    className="w-24 h-24 rounded-xl"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View className="w-24 h-24 rounded-xl bg-gray-200 items-center justify-center">
                                                    <Text className="text-gray-500 text-xs">No Image</Text>
                                                </View>
                                            )}
                                        </View>

                                        <View className="flex-1">
                                            <Text className="text-base font-bold text-[#070707]" numberOfLines={2}>
                                                {item.name}
                                            </Text>
                                            {item.description && (
                                                <Text className="text-sm text-gray-600 mt-1" numberOfLines={2}>
                                                    {item.description}
                                                </Text>
                                            )}
                                            <View className="flex-row items-center justify-between mt-2">
                                                <Text className="text-lg font-bold text-[#E95322]">
                                                    ${formatPrice(item.price)}
                                                </Text>
                                                {!item.is_available && (
                                                    <Text className="text-xs text-red-600 font-semibold">
                                                        Unavailable
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {item.is_available && (
                                        <View className="flex-row items-center justify-between px-4 pb-4">
                                            <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1">
                                                <TouchableOpacity
                                                    onPress={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 rounded-full bg-white items-center justify-center"
                                                    activeOpacity={0.7}
                                                >
                                                    <Minus size={16} color="#E95322" />
                                                </TouchableOpacity>

                                                <Text className="mx-4 text-[#391713] font-semibold min-w-[20px] text-center">
                                                    {quantities[item.id] || 0}
                                                </Text>

                                                <TouchableOpacity
                                                    onPress={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 rounded-full bg-[#E95322] items-center justify-center"
                                                    activeOpacity={0.7}
                                                >
                                                    <Plus size={16} color="#FFFFFF" />
                                                </TouchableOpacity>
                                            </View>

                                            <TouchableOpacity
                                                className="flex-row items-center bg-[#E95322] px-6 py-2 rounded-full"
                                                activeOpacity={0.8}
                                                onPress={() => handleAddToCart(item)}
                                                disabled={addingToCart === item.id || (quantities[item.id] || 0) === 0}
                                            >
                                                {addingToCart === item.id ? (
                                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={18} color="#FFFFFF" />
                                                        <Text className="text-white font-semibold ml-2">Add</Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            ))
                        ) : (
                            <View className="items-center py-10">
                                <Text className="text-gray-500">No menu items available</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
