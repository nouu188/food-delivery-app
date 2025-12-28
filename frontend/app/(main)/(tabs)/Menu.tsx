import { Categories, SearchNav } from "@/components/common";
import NotificationSidebar from "@/components/common/notification/NotificationSidebar";
import ProfileSidebar from "@/components/common/profile/ProfileSidebar";
import { ChevronDown, Star, SlidersHorizontal, Search, List, MapPin, Clock, X, Grid3x3 } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatRating } from "@/utils/format";
import FilterModal, { FilterOptions } from "../../../src/components/common/menu/FilterModal";
import { useOverlayStore } from "@/store/useOverlayStore";

type ViewMode = "list" | "grid";

export default function MenuScreen() {
    const [sortBy, setSortBy] = useState<"popular" | "rating" | "name">("popular");
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const isNotificationVisible = useOverlayStore((s) => s.isNotificationSidebarOpen);
    const isProfileVisible = useOverlayStore((s) => s.isProfileSidebarOpen);
    const openNotificationSidebar = useOverlayStore((s) => s.openNotificationSidebar);
    const closeNotificationSidebar = useOverlayStore((s) => s.closeNotificationSidebar);
    const openProfileSidebar = useOverlayStore((s) => s.openProfileSidebar);
    const closeProfileSidebar = useOverlayStore((s) => s.closeProfileSidebar);
    const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSearch, setShowSearch] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [filters, setFilters] = useState<FilterOptions>({});
    const [activeQuickFilters, setActiveQuickFilters] = useState({
        openNow: false,
        featured: false,
        topRated: false,
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, restaurants, filters, activeQuickFilters]);

    const applyFilters = useCallback(() => {
        let filtered = [...restaurants];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (r) =>
                    r.name.toLowerCase().includes(query) ||
                    r.address?.toLowerCase().includes(query) ||
                    r.description?.toLowerCase().includes(query)
            );
        }

        if (filters.minRating) {
            filtered = filtered.filter((r) => Number(r.average_rating) >= filters.minRating!);
        }

        if (filters.priceRange) {
            filtered = filtered.filter((r) => {
                const minOrder = Number(r.min_order_amount);
                return minOrder >= filters.priceRange!.min && minOrder <= filters.priceRange!.max;
            });
        }

        if (filters.deliveryFee) {
            filtered = filtered.filter((r) => {
                const fee = Number(r.delivery_fee);
                return fee >= filters.deliveryFee!.min && fee <= filters.deliveryFee!.max;
            });
        }

        if (filters.isOpenOnly) {
            filtered = filtered.filter((r) => r.is_open);
        }

        if (filters.isFeaturedOnly) {
            filtered = filtered.filter((r) => r.is_featured);
        }

        if (activeQuickFilters.openNow) {
            filtered = filtered.filter((r) => r.is_open);
        }

        if (activeQuickFilters.featured) {
            filtered = filtered.filter((r) => r.is_featured);
        }

        if (activeQuickFilters.topRated) {
            filtered = filtered.filter((r) => Number(r.average_rating) >= 4.5);
        }

        setFilteredRestaurants(filtered);
    }, [searchQuery, restaurants, filters, activeQuickFilters]);

    const fetchRestaurants = async (pageNum = 1, showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else if (pageNum === 1) {
                setIsLoading(true);
            }

            const [restaurantsData, favoritesData] = await Promise.all([
                restaurantService
                    .getRestaurants({
                        page: pageNum,
                        limit: 20,
                        sort_by: sortBy,
                    })
                    .catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            if (restaurantsData?.data && Array.isArray(restaurantsData.data)) {
                if (pageNum === 1) {
                    setRestaurants(restaurantsData.data);
                    setFilteredRestaurants(restaurantsData.data);
                } else {
                    setRestaurants((prev) => [...prev, ...restaurantsData.data]);
                }
                setHasMore(restaurantsData.page < restaurantsData.total_pages);
            } else {
                if (pageNum === 1) {
                    setRestaurants([]);
                    setFilteredRestaurants([]);
                }
                setHasMore(false);
            }

            if (favoritesData && Array.isArray(favoritesData)) {
                setFavorites(new Set(favoritesData.map((f) => f.restaurant_id)));
            } else {
                setFavorites(new Set());
            }
        } catch (error) {
            showErrorAlert(error, "Failed to Load Restaurants");
            if (pageNum === 1) {
                setRestaurants([]);
                setFilteredRestaurants([]);
            }
            setFavorites(new Set());
            setHasMore(false);
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
            showErrorAlert(error, "Failed to Update Favorite");
        }
    };

    const toggleQuickFilter = (filter: keyof typeof activeQuickFilters) => {
        setActiveQuickFilters((prev) => ({
            ...prev,
            [filter]: !prev[filter],
        }));
    };

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.minRating) count++;
        if (filters.priceRange) count++;
        if (filters.deliveryFee) count++;
        if (filters.isOpenOnly) count++;
        if (filters.isFeaturedOnly) count++;
        return count;
    }, [filters]);

    const renderListItem = ({ item }: { item: Restaurant }) => {
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

                            {item.is_featured && (
                                <View className="absolute left-3 bottom-3 bg-[#F4BA1B] px-3 py-1 rounded-full">
                                    <Text className="text-white text-xs font-bold">FEATURED</Text>
                                </View>
                            )}
                        </View>

                        <View className="px-4 py-3">
                            <Text numberOfLines={1} className="text-[#391713] text-lg font-bold leading-5">
                                {item.name}
                            </Text>
                            {item.address && (
                                <View className="flex-row items-center mt-1">
                                    <MapPin size={12} color="#9CA3AF" />
                                    <Text numberOfLines={1} className="text-[#9CA3AF] text-xs ml-1 flex-1">
                                        {item.address}
                                    </Text>
                                </View>
                            )}
                            <View className="flex-row items-center justify-between mt-2">
                                <View className="flex-row items-center">
                                    <Clock size={12} color="#6B7280" />
                                    <Text className="text-[#6B7280] text-xs ml-1">{item.estimated_prep_time} mins</Text>
                                </View>
                                <Text className="text-[#E95322] text-sm font-semibold">
                                    ${Number(item.delivery_fee) / 1000}k delivery
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                </Link>
            </View>
        );
    };

    const renderGridItem = ({ item }: { item: Restaurant }) => {
        return (
            <Link href={{ pathname: "/restaurant/[id]", params: { id: item.id } }} asChild>
                <Pressable className="w-[48%] mb-3">
                    <View
                        className="bg-white rounded-2xl overflow-hidden"
                        style={{
                            elevation: 2,
                            shadowColor: "#000",
                            shadowOpacity: 0.08,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                        }}
                    >
                        <View className="relative">
                            {item.logo_url ? (
                                <Image source={{ uri: item.logo_url }} className="w-full h-32" resizeMode="cover" />
                            ) : (
                                <View className="w-full h-32 bg-gray-200 items-center justify-center">
                                    <Text className="text-gray-400 text-xs">No Image</Text>
                                </View>
                            )}

                            {item.is_open !== undefined && (
                                <View
                                    className={`absolute left-2 top-2 px-2 py-0.5 rounded-full ${
                                        item.is_open ? "bg-green-500" : "bg-red-500"
                                    }`}
                                >
                                    <Text className="text-white text-[10px] font-semibold">
                                        {item.is_open ? "OPEN" : "CLOSED"}
                                    </Text>
                                </View>
                            )}

                            {item.average_rating && (
                                <View className="absolute right-2 top-2 bg-white/90 rounded-full px-1.5 py-0.5 flex-row items-center">
                                    <Star size={10} color="#F15A24" fill="#F15A24" />
                                    <Text className="text-[#F15A24] text-[10px] font-bold ml-0.5">
                                        {formatRating(item.average_rating)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="p-3">
                            <Text numberOfLines={1} className="text-[#070707] text-sm font-bold">
                                {item.name}
                            </Text>
                            <Text className="text-[#6B7280] text-[10px] mt-0.5">
                                {item.estimated_prep_time} mins • ${Number(item.delivery_fee) / 1000}k
                            </Text>
                        </View>
                    </View>
                </Pressable>
            </Link>
        );
    };

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="bg-[#F9CF63] pt-14 pb-2">
                <View className="px-5">
                    <SearchNav onNotificationPress={openNotificationSidebar} onProfilePress={openProfileSidebar} />
                </View>

                <View
                    className="bg-[#E95322] pb-6"
                    style={{
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 6 },
                        shadowRadius: 12,
                        elevation: 2,
                        transform: [{ translateY: 30 }],
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                    }}
                >
                    <Categories />
                </View>
            </View>

            <View
                className="flex-1 pt-4"
                style={{
                    backgroundColor: "#fff",
                    borderTopRightRadius: 32,
                    borderTopLeftRadius: 32,
                }}
            >
                <View className="px-5 mb-4">
                    <View className="flex-row items-center">
                        {!showSearch ? (
                            <>
                                <TouchableOpacity
                                    onPress={() => setShowSearch(true)}
                                    className="bg-gray-100 p-2.5 rounded-full mr-2"
                                    activeOpacity={0.7}
                                >
                                    <Search size={20} color="#070707" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    className="flex-row items-center bg-gray-100 px-3 py-2 rounded-full mr-2"
                                    onPress={() =>
                                        setSortBy(
                                            sortBy === "popular" ? "rating" : sortBy === "rating" ? "name" : "popular"
                                        )
                                    }
                                >
                                    <Text className="text-[#070707] font-semibold text-sm mr-1">
                                        {sortBy === "popular" ? "Popular" : sortBy === "rating" ? "Rating" : "Name"}
                                    </Text>
                                    <ChevronDown size={16} color="#F15A24" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setIsFilterModalVisible(true)}
                                    className="relative bg-gray-100 p-2.5 rounded-full mr-2"
                                    activeOpacity={0.7}
                                >
                                    <SlidersHorizontal size={20} color="#070707" />
                                    {activeFiltersCount > 0 && (
                                        <View className="absolute -top-1 -right-1 bg-[#E95322] rounded-full w-5 h-5 items-center justify-center">
                                            <Text className="text-white text-xs font-bold">{activeFiltersCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                                    className="bg-gray-100 p-2.5 rounded-full"
                                    activeOpacity={0.7}
                                >
                                    {viewMode === "list" ? (
                                        <Grid3x3 size={20} color="#070707" />
                                    ) : (
                                        <List size={20} color="#070707" />
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <View className="flex flex-row">
                                <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-2 pl-3 mr-2">
                                    <Search size={20} color="#6B7280" />
                                    <TextInput
                                        className="flex-1 py-1 px-3 text-[#070707]"
                                        placeholder="Search restaurants..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        autoFocus
                                        placeholderTextColor="#9CA3AF"
                                    />
                                    {searchQuery.length > 0 && (
                                        <TouchableOpacity onPress={() => setSearchQuery("")} className="p-1 mr-2">
                                            <X size={18} color="#6B7280" />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowSearch(false);
                                            setSearchQuery("");
                                        }}
                                        className="bg-[#E95322] p-2 rounded-full"
                                        activeOpacity={0.7}
                                    >
                                        <X size={12} color="#FFFFFF" />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => setIsFilterModalVisible(true)}
                                    className="relative bg-gray-100 p-2.5 rounded-full mr-2"
                                    activeOpacity={0.7}
                                >
                                    <SlidersHorizontal size={20} color="#070707" />
                                    {activeFiltersCount > 0 && (
                                        <View className="absolute -top-1 -right-1 bg-[#E95322] rounded-full w-5 h-5 items-center justify-center">
                                            <Text className="text-white text-xs font-bold">{activeFiltersCount}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                                    className="bg-gray-100 p-2.5 rounded-full"
                                    activeOpacity={0.7}
                                >
                                    {viewMode === "list" ? (
                                        <Grid3x3 size={20} color="#070707" />
                                    ) : (
                                        <List size={20} color="#070707" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    <View className="flex-row mt-3">
                        <TouchableOpacity
                            onPress={() => toggleQuickFilter("openNow")}
                            className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
                                activeQuickFilters.openNow ? "bg-green-500" : "bg-gray-100"
                            }`}
                            activeOpacity={0.7}
                        >
                            <View
                                className={`w-2 h-2 rounded-full ${
                                    activeQuickFilters.openNow ? "bg-white" : "bg-green-500"
                                }`}
                            />
                            <Text
                                className={`ml-1.5 text-xs font-semibold ${
                                    activeQuickFilters.openNow ? "text-white" : "text-[#070707]"
                                }`}
                            >
                                Open Now
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => toggleQuickFilter("featured")}
                            className={`flex-row items-center px-3 py-2 rounded-full mr-2 ${
                                activeQuickFilters.featured ? "bg-[#F4BA1B]" : "bg-gray-100"
                            }`}
                            activeOpacity={0.7}
                        >
                            <Star
                                size={12}
                                color={activeQuickFilters.featured ? "#FFFFFF" : "#F4BA1B"}
                                fill={activeQuickFilters.featured ? "#FFFFFF" : "#F4BA1B"}
                            />
                            <Text
                                className={`ml-1 text-xs font-semibold ${
                                    activeQuickFilters.featured ? "text-white" : "text-[#070707]"
                                }`}
                            >
                                Featured
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => toggleQuickFilter("topRated")}
                            className={`flex-row items-center px-3 py-2 rounded-full ${
                                activeQuickFilters.topRated ? "bg-[#E95322]" : "bg-gray-100"
                            }`}
                            activeOpacity={0.7}
                        >
                            <Star
                                size={12}
                                color={activeQuickFilters.topRated ? "#FFFFFF" : "#E95322"}
                                fill={activeQuickFilters.topRated ? "#FFFFFF" : "#E95322"}
                            />
                            <Text
                                className={`ml-1 text-xs font-semibold ${
                                    activeQuickFilters.topRated ? "text-white" : "text-[#070707]"
                                }`}
                            >
                                Top Rated
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {searchQuery || activeFiltersCount > 0 || Object.values(activeQuickFilters).some((v) => v) ? (
                        <Text className="text-[#6B7280] text-sm mt-3">
                            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? "s" : ""} found
                        </Text>
                    ) : null}
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading restaurants...</Text>
                    </View>
                ) : filteredRestaurants.length === 0 ? (
                    <View className="items-center py-20">
                        <Text className="text-xl font-medium text-gray-600">No restaurants found</Text>
                        <Text className="text-gray-500 text-center mt-2 px-8">
                            Try adjusting your filters or search query
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={filteredRestaurants}
                        keyExtractor={(item) => item.id}
                        renderItem={viewMode === "list" ? renderListItem : renderGridItem}
                        numColumns={viewMode === "grid" ? 2 : 1}
                        key={viewMode}
                        columnWrapperStyle={viewMode === "grid" ? { justifyContent: "space-between" } : undefined}
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

            <FilterModal
                visible={isFilterModalVisible}
                onClose={() => setIsFilterModalVisible(false)}
                onApply={setFilters}
                currentFilters={filters}
            />

            <NotificationSidebar isVisible={isNotificationVisible} onClose={closeNotificationSidebar} />
            <ProfileSidebar isVisible={isProfileVisible} onClose={closeProfileSidebar} />
        </View>
    );
}
