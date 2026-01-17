import { banners, bestSeller, recommend } from "@/assets/images/index";
import { Categories } from "@/components/common";
import NotificationSidebar from "@/components/common/notification/NotificationSidebar";
import ProfileSidebar from "@/components/common/profile/ProfileSidebar";
import SearchNav from "@/components/common/SearchNav";
import { ChevronRight, Heart, Star } from "@tamagui/lucide-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import restaurantService from "@/services/api/restaurant.service";
import userService from "@/services/api/user.service";
import { Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatRating } from "@/utils/format";
import { useOverlayStore } from "@/store/useOverlayStore";
import { useFavoritesStore } from "@/store/useFavoritesStore";

const BANNERS = [
    {
        id: "b1",
        image: banners.banner1,
        title: "Experience our delicious new dish",
        subtitle: "30% OFF",
    },
    { id: "b2", image: banners.banner1, title: "Try our new pasta", subtitle: "TODAY ONLY" },
    {
        id: "b3",
        image: banners.banner1,
        title: "Fresh sushi everyday",
        subtitle: "BEST PRICE",
    },
];

const HomeScreen = () => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const isNotificationVisible = useOverlayStore((s) => s.isNotificationSidebarOpen);
    const isProfileVisible = useOverlayStore((s) => s.isProfileSidebarOpen);
    const openNotificationSidebar = useOverlayStore((s) => s.openNotificationSidebar);
    const closeNotificationSidebar = useOverlayStore((s) => s.closeNotificationSidebar);
    const openProfileSidebar = useOverlayStore((s) => s.openProfileSidebar);
    const closeProfileSidebar = useOverlayStore((s) => s.closeProfileSidebar);
    const { width } = useWindowDimensions();
    const bannerWidth = width - 40;

    const [bestSellers, setBestSellers] = useState<Restaurant[]>([]);
    const [recommended, setRecommended] = useState<Restaurant[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const setFavoriteRestaurantIds = useFavoritesStore((s) => s.setFavoriteRestaurantIds);
    const addFavoriteRestaurantId = useFavoritesStore((s) => s.addFavoriteRestaurantId);
    const removeFavoriteRestaurantId = useFavoritesStore((s) => s.removeFavoriteRestaurantId);

    const fetchData = async (showRefreshIndicator = false) => {
        try {
            if (showRefreshIndicator) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }

            const [bestSellersData, recommendedData, favoritesData] = await Promise.all([
                restaurantService.getRestaurants({ limit: 4, sort_by: "rating" }).catch(() => null),
                restaurantService.getRestaurants({ limit: 2, sort_by: "popular" }).catch(() => null),
                userService.getFavorites().catch(() => null),
            ]);

            setBestSellers(bestSellersData?.data ?? []);
            setRecommended(recommendedData?.data ?? []);

            if (favoritesData && Array.isArray(favoritesData)) {
                const ids = favoritesData.map((f) => f.restaurant_id);
                setFavorites(new Set(ids));
                setFavoriteRestaurantIds(ids);
            } else {
                setFavorites(new Set());
                setFavoriteRestaurantIds([]);
            }
        } catch (error) {
            showErrorAlert(error, "Failed to Load Data");

            setBestSellers([]);
            setRecommended([]);
            setFavorites(new Set());
            setFavoriteRestaurantIds([]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            showErrorAlert(error, "Failed to Update Favorite");
        }
    };

    return (
        <View className="flex-1 bg-[#F5CB58] pt-10">
            <View className="px-5 pt-12 pb-4">
                <SearchNav onNotificationPress={openNotificationSidebar} onProfilePress={openProfileSidebar} />

                <View className="mt-5">
                    <Text className="text-white text-3xl font-extrabold">Good Morning</Text>
                    <Text className="text-[#E95322] text-xl font-bold mt-1">
                        Rise And Shine! It&#39;s Breakfast Time
                    </Text>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl overflow-hidden">
                <View className="mb-5">
                    <Categories />
                </View>

                {isLoading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#E95322" />
                        <Text className="text-gray-500 mt-4">Loading restaurants...</Text>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1 rounded-t-3xl"
                        contentContainerStyle={{ paddingBottom: 140 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={() => fetchData(true)}
                                tintColor="#E95322"
                            />
                        }
                    >
                        <View className="px-5">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-lg font-semibold text-[#151312]">Best Seller</Text>
                                <Link href="/BestSeller" asChild>
                                    <TouchableOpacity className="flex-row items-center">
                                        <Text className="text-[#E95322] mr-1">View All</Text>
                                        <ChevronRight size={16} color="#E95322" />
                                    </TouchableOpacity>
                                </Link>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                                {bestSellers.length > 0 ? (
                                    bestSellers.map((restaurant) => (
                                        <View key={restaurant.id} className="mx-2" style={{ width: 110 }}>
                                            <Link
                                                href={{ pathname: "/restaurant/[id]", params: { id: restaurant.id } }}
                                                asChild
                                            >
                                                <TouchableOpacity>
                                                    {restaurant.logo_url ? (
                                                        <Image
                                                            source={{ uri: restaurant.logo_url }}
                                                            className="h-[128px] w-full rounded-[24px]"
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <View className="h-[128px] w-full rounded-[24px] bg-gray-200 items-center justify-center">
                                                            <Text className="text-gray-500 text-xs">No Image</Text>
                                                        </View>
                                                    )}
                                                </TouchableOpacity>
                                            </Link>
                                            {restaurant.average_rating && (
                                                <View className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-full flex-row items-center">
                                                    <Star size={10} color="#F4BA1B" fill="#F4BA1B" />
                                                    <Text className="text-xs font-semibold ml-1">
                                                        {formatRating(restaurant.average_rating)}
                                                    </Text>
                                                </View>
                                            )}
                                            <Text className="mt-2 font-medium text-[#151312]" numberOfLines={1}>
                                                {restaurant.name}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-gray-500">No best sellers available</Text>
                                )}
                            </ScrollView>
                        </View>

                        <View className="px-5 mt-6">
                            <Carousel
                                width={bannerWidth}
                                height={164}
                                data={BANNERS}
                                autoPlay
                                autoPlayInterval={3000}
                                scrollAnimationDuration={800}
                                onSnapToItem={(index) => setActiveIndex(index)}
                                renderItem={({ item }) => (
                                    <View className="rounded-3xl overflow-hidden mr-3">
                                        <ImageBackground
                                            source={item.image}
                                            resizeMode="cover"
                                            className="h-[164px] flex-row"
                                        >
                                            {(item.title || item.subtitle) && (
                                                <View className="flex-1 justify-center pl-4">
                                                    {!!item.title && (
                                                        <Text
                                                            className="text-white text-base font-semibold mr-3"
                                                            numberOfLines={2}
                                                        >
                                                            {item.title}
                                                        </Text>
                                                    )}
                                                    {!!item.subtitle && (
                                                        <Text className="text-white text-3xl font-extrabold mt-1">
                                                            {item.subtitle}
                                                        </Text>
                                                    )}
                                                </View>
                                            )}
                                        </ImageBackground>
                                    </View>
                                )}
                            />

                            <View className="flex-row items-center justify-center mt-3">
                                {BANNERS.map((_, i) => (
                                    <View
                                        key={i}
                                        className={`h-1.5 rounded-full mx-1 ${
                                            i === activeIndex ? "bg-[#E95322] w-6" : "bg-[#F5D8B8] w-3"
                                        }`}
                                    />
                                ))}
                            </View>
                        </View>

                        <View className="px-5 mt-6 pb-4">
                            <View className="flex-row items-center justify-between mb-3">
                                <Text className="text-lg font-semibold text-[#151312]">Recommend</Text>
                                <Link href="/Recommend" asChild>
                                    <TouchableOpacity className="flex-row items-center">
                                        <Text className="text-[#E95322] mr-1">View All</Text>
                                        <ChevronRight size={16} color="#E95322" />
                                    </TouchableOpacity>
                                </Link>
                            </View>
                            <View className="flex-row flex-wrap -mx-2">
                                {recommended.length > 0 ? (
                                    recommended.map((restaurant) => (
                                        <View key={restaurant.id} className="w-1/2 px-2 mb-6">
                                            <View className="relative">
                                                <Link
                                                    href={{
                                                        pathname: "/restaurant/[id]",
                                                        params: { id: restaurant.id },
                                                    }}
                                                    asChild
                                                >
                                                    <TouchableOpacity activeOpacity={0.8}>
                                                        {restaurant.logo_url ? (
                                                            <Image
                                                                source={{ uri: restaurant.logo_url }}
                                                                className="rounded-3xl h-40 w-full"
                                                                resizeMode="cover"
                                                            />
                                                        ) : (
                                                            <View className="rounded-3xl h-40 w-full bg-gray-200 items-center justify-center">
                                                                <Text className="text-gray-500">No Image</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                </Link>

                                                {restaurant.average_rating && (
                                                    <View className="absolute left-3 top-3 bg-white/95 rounded-full px-2.5 py-1.5 flex-row items-center shadow-sm">
                                                        <Text className="text-[#151312] text-xs font-semibold mr-1">
                                                            {formatRating(restaurant.average_rating)}
                                                        </Text>
                                                        <Star size={12} color="#F4BA1B" fill="#F4BA1B" />
                                                    </View>
                                                )}

                                                <TouchableOpacity
                                                    onPress={() => toggleFavorite(restaurant.id)}
                                                    className="absolute right-3 top-3 bg-white/95 rounded-full p-2 shadow-sm"
                                                    activeOpacity={0.7}
                                                >
                                                    <Heart
                                                        size={20}
                                                        color="#E95322"
                                                        fill={favorites.has(restaurant.id) ? "#E95322" : "none"}
                                                        strokeWidth={2}
                                                    />
                                                </TouchableOpacity>
                                            </View>

                                            <Text
                                                className="mt-4 font-semibold text-[#151312] text-base"
                                                numberOfLines={1}
                                            >
                                                {restaurant.name}
                                            </Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text className="text-gray-500 px-2">No recommendations available</Text>
                                )}
                            </View>
                        </View>
                    </ScrollView>
                )}
            </View>

            <NotificationSidebar isVisible={isNotificationVisible} onClose={closeNotificationSidebar} />
            <ProfileSidebar isVisible={isProfileVisible} onClose={closeProfileSidebar} />
        </View>
    );
};

export default HomeScreen;
