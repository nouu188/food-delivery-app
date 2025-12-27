import Header from "@/components/common/Header";
import FloatingCartButton from "@/components/common/restaurant/FloatingCartButton";
import MenuItemModal from "@/components/common/restaurant/MenuItemModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, MapPin, Clock, Star, ShoppingCart, Search, Filter, X } from "lucide-react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { useCartStore } from "@/store/useCartStore";
import { Restaurant, MenuItem, MenuCategory } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatPrice, formatRating } from "@/utils/format";
import { CartSidebar } from "@/components/common/cart";

const ITEMS_PER_PAGE = 10;

export default function RestaurantDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
    const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
    const [displayedItems, setDisplayedItems] = useState<MenuItem[]>([]);

    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name' | null>(null);

    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
    const [showItemModal, setShowItemModal] = useState(false);

    const { addToCart, clearCart, openDrawer } = useCartStore();

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

            if (menuCategories && Array.isArray(menuCategories)) {
                setMenuCategories(menuCategories);

                const allItems: MenuItem[] = [];
                menuCategories.forEach(category => {
                    if (category?.items && Array.isArray(category.items)) {
                        allItems.push(...category.items);
                    }
                });
                setAllMenuItems(allItems);
                setFilteredItems(allItems);
            }

            if (favoritesData && Array.isArray(favoritesData)) {
                setIsFavorite(favoritesData.some(f => f.restaurant_id === id));
            } else {
                setIsFavorite(false);
            }
        } catch (error) {
            showErrorAlert(error, 'Failed to Load Restaurant');
            router.back();
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        let items = [...allMenuItems];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description?.toLowerCase().includes(query)
            );
        }

        if (selectedCategory) {
            items = items.filter(item => item.category_id === selectedCategory);
        }

        if (sortBy === 'price_asc') {
            items.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (sortBy === 'price_desc') {
            items.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (sortBy === 'name') {
            items.sort((a, b) => a.name.localeCompare(b.name));
        }

        setFilteredItems(items);
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortBy, allMenuItems]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setDisplayedItems(filteredItems.slice(startIndex, endIndex));
    }, [filteredItems, currentPage]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

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

    const handleMenuItemPress = (item: MenuItem) => {
        if (item.options && item.options.length > 0) {
            setSelectedMenuItem(item);
            setShowItemModal(true);
        } else {
            handleQuickAdd(item);
        }
    };

    const handleQuickAdd = async (item: MenuItem, forceReplace = false) => {
        setAddingToCart(true);
        let isConflictError = false;

        try {
            if (forceReplace) {
                await clearCart();
            }

            await addToCart({
                menu_item_id: item.id,
                quantity: 1,
            });

            Alert.alert("Success", `${item.name} added to cart!`);
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
                            onPress: () => setAddingToCart(false),
                        },
                        {
                            text: 'Replace Cart',
                            style: 'destructive',
                            onPress: () => handleQuickAdd(item, true),
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }
            showErrorAlert(error, 'Failed to Add to Cart');
        } finally {
            if (!isConflictError) {
                setAddingToCart(false);
            }
        }
    };

    const handleAddToCartFromModal = async (
        item: MenuItem,
        quantity: number,
        selectedOptions: Array<{
            option_group: string;
            name: string;
            price_modifier: number;
        }>,
        specialInstructions?: string,
        forceReplace = false
    ) => {
        setAddingToCart(true);
        let isConflictError = false;

        try {
            if (forceReplace) {
                await clearCart();
            }

            await addToCart({
                menu_item_id: item.id,
                quantity,
                selected_options: selectedOptions.length > 0 ? selectedOptions : undefined,
                special_instructions: specialInstructions,
            });

            Alert.alert("Success", `${item.name} added to cart!`);
            setShowItemModal(false);
            setSelectedMenuItem(null);
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
                        },
                        {
                            text: 'Replace Cart',
                            style: 'destructive',
                            onPress: () => handleAddToCartFromModal(item, quantity, selectedOptions, specialInstructions, true),
                        },
                    ],
                    { cancelable: false }
                );
                return;
            }
            showErrorAlert(error, 'Failed to Add to Cart');
        } finally {
            if (!isConflictError) {
                setAddingToCart(false);
            }
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSelectedCategory(null);
        setSortBy(null);
        setShowFilters(false);
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

                    <View className="px-5 pt-6">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4">
                                <Search size={20} color="#9CA3AF" />
                                <TextInput
                                    className="flex-1 ml-2 text-base"
                                    placeholder="Search menu items..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholderTextColor="#9CA3AF"
                                />
                                {searchQuery.length > 0 && (
                                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                                        <X size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={() => setShowFilters(!showFilters)}
                                className="bg-[#E95322] p-3 rounded-full"
                            >
                                <Filter size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {showFilters && (
                            <View className="bg-[#FFF5E6] rounded-2xl p-4 mb-4">
                                <View className="flex-row items-center justify-between mb-3">
                                    <Text className="font-bold text-[#070707]">Filters</Text>
                                    <TouchableOpacity onPress={clearFilters}>
                                        <Text className="text-[#E95322] font-semibold text-sm">Clear All</Text>
                                    </TouchableOpacity>
                                </View>

                                {menuCategories.length > 0 && (
                                    <View className="mb-3">
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">Categories</Text>
                                        <View className="flex-row flex-wrap gap-2">
                                            {menuCategories.map(category => (
                                                <TouchableOpacity
                                                    key={category.id}
                                                    onPress={() => setSelectedCategory(
                                                        selectedCategory === category.id ? null : category.id
                                                    )}
                                                    className={`px-4 py-2 rounded-full ${
                                                        selectedCategory === category.id
                                                            ? 'bg-[#E95322]'
                                                            : 'bg-white border border-gray-300'
                                                    }`}
                                                >
                                                    <Text className={`text-sm font-medium ${
                                                        selectedCategory === category.id
                                                            ? 'text-white'
                                                            : 'text-gray-700'
                                                    }`}>
                                                        {category.name}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                <View>
                                    <Text className="text-sm font-semibold text-gray-700 mb-2">Sort By</Text>
                                    <View className="flex-row flex-wrap gap-2">
                                        {[
                                            { value: 'name', label: 'Name' },
                                            { value: 'price_asc', label: 'Price: Low to High' },
                                            { value: 'price_desc', label: 'Price: High to Low' },
                                        ].map(option => (
                                            <TouchableOpacity
                                                key={option.value}
                                                onPress={() => setSortBy(
                                                    sortBy === option.value ? null : option.value as any
                                                )}
                                                className={`px-4 py-2 rounded-full ${
                                                    sortBy === option.value
                                                        ? 'bg-[#E95322]'
                                                        : 'bg-white border border-gray-300'
                                                }`}
                                            >
                                                <Text className={`text-sm font-medium ${
                                                    sortBy === option.value
                                                        ? 'text-white'
                                                        : 'text-gray-700'
                                                }`}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-lg font-bold text-[#070707]">
                                Menu {filteredItems.length > 0 && `(${filteredItems.length})`}
                            </Text>
                            {(searchQuery || selectedCategory || sortBy) && (
                                <Text className="text-sm text-gray-600">
                                    Showing {displayedItems.length} of {filteredItems.length}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View className="px-5 pb-32">
                        {displayedItems.length > 0 ? (
                            <>
                                {displayedItems.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        onPress={() => handleMenuItemPress(item)}
                                        activeOpacity={0.9}
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
                                                    {!item.is_available ? (
                                                        <Text className="text-xs text-red-600 font-semibold">
                                                            Unavailable
                                                        </Text>
                                                    ) : (
                                                        <View className="flex-row items-center">
                                                            <ShoppingCart size={16} color="#E95322" />
                                                            <Text className="text-[#E95322] font-semibold ml-1 text-sm">
                                                                Add
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}

                                {totalPages > 1 && (
                                    <View className="flex-row items-center justify-center gap-2 mt-4">
                                        <TouchableOpacity
                                            onPress={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className={`px-4 py-2 rounded-full ${
                                                currentPage === 1 ? 'bg-gray-200' : 'bg-[#E95322]'
                                            }`}
                                        >
                                            <Text className={`font-semibold ${
                                                currentPage === 1 ? 'text-gray-400' : 'text-white'
                                            }`}>
                                                Previous
                                            </Text>
                                        </TouchableOpacity>

                                        <Text className="text-gray-600 font-medium">
                                            {currentPage} of {totalPages}
                                        </Text>

                                        <TouchableOpacity
                                            onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className={`px-4 py-2 rounded-full ${
                                                currentPage === totalPages ? 'bg-gray-200' : 'bg-[#E95322]'
                                            }`}
                                        >
                                            <Text className={`font-semibold ${
                                                currentPage === totalPages ? 'text-gray-400' : 'text-white'
                                            }`}>
                                                Next
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        ) : (
                            <View className="items-center py-10">
                                <Text className="text-gray-500">
                                    {searchQuery || selectedCategory || sortBy
                                        ? 'No menu items match your filters'
                                        : 'No menu items available'}
                                </Text>
                                {(searchQuery || selectedCategory || sortBy) && (
                                    <TouchableOpacity
                                        onPress={clearFilters}
                                        className="mt-4 px-6 py-3 bg-[#E95322] rounded-full"
                                    >
                                        <Text className="text-white font-semibold">Clear Filters</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                </ScrollView>

                <FloatingCartButton onPress={openDrawer} />
            </View>

            <MenuItemModal
                visible={showItemModal}
                item={selectedMenuItem}
                onClose={() => {
                    setShowItemModal(false);
                    setSelectedMenuItem(null);
                }}
                onAddToCart={handleAddToCartFromModal}
                isAdding={addingToCart}
            />

            <CartSidebar />
        </SafeAreaView>
    );
}
