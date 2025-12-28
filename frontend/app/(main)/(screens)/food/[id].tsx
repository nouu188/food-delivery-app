import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import restaurantService from "@/services/api/restaurant.service";
import { useCartStore } from "@/store/useCartStore";
import { MenuItem, MenuItemOption, Restaurant } from "@/types/api/restaurant";
import { showErrorAlert } from "@/utils/error-handler";
import { formatPrice, parseNumeric } from "@/utils/format";
import { useToastStore } from "@/store/useToastStore";
import { confirm } from "@/utils/confirm";

export default function FoodDetail() {
    const router = useRouter();
    const showToast = useToastStore((s) => s.show);
    const { id, restaurantId } = useLocalSearchParams<{ id: string; restaurantId: string }>();
    const { addToCart, clearCart } = useCartStore();

    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [qty, setQty] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState<MenuItemOption[]>([]);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        fetchMenuItem();
    }, [id, restaurantId]);

    const fetchMenuItem = async () => {
        if (!id || !restaurantId) {
            showToast({ type: "error", title: "Error", message: "Menu item information is missing" });
            router.back();
            return;
        }

        try {
            setIsLoading(true);
            const [menuCategories, restaurantData] = await Promise.all([
                restaurantService.getMenu(restaurantId),
                restaurantService.getRestaurantById(restaurantId).catch(() => null)
            ]);

            // Set restaurant data
            if (restaurantData) {
                setRestaurant(restaurantData);
            }

            let foundItem: MenuItem | null = null;
            if (menuCategories && Array.isArray(menuCategories)) {
                for (const category of menuCategories) {
                    if (category?.items && Array.isArray(category.items)) {
                        const item = category.items.find((menuItem: MenuItem) => menuItem.id === id);
                        if (item) {
                            foundItem = item;
                            break;
                        }
                    }
                }
            }

            if (!foundItem) {
                showToast({ type: "error", title: "Error", message: "Menu item not found" });
                router.back();
                return;
            }

            setMenuItem(foundItem);

            if (foundItem.options && Array.isArray(foundItem.options)) {
                const defaultOpts = foundItem.options.filter((opt) => opt.is_default);
                setSelectedOptions(defaultOpts);
            }
        } catch (error) {
            showErrorAlert(error, "Failed to Load Menu Item");
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOption = (option: MenuItemOption) => {
        const existingIndex = selectedOptions.findIndex((opt) => opt.option_group === option.option_group);

        if (existingIndex !== -1) {
            const newOptions = [...selectedOptions];
            newOptions[existingIndex] = option;
            setSelectedOptions(newOptions);
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    const isOptionSelected = (option: MenuItemOption): boolean => {
        return selectedOptions.some((opt) => opt.id === option.id && opt.option_group === option.option_group);
    };

    const calculateTotalPrice = (): number => {
        if (!menuItem) return 0;

        const basePrice = Number(menuItem.price);
        const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price_modifier, 0);
        const totalPrice = (basePrice + optionsPrice) * qty;

        return totalPrice;
    };

    const handleAddToCart = async (forceReplace = false) => {
        if (!menuItem) return;

        // Check if restaurant is closed
        if (restaurant && !restaurant.is_open) {
            showToast({
                type: 'error',
                title: 'Restaurant Closed',
                message: 'This restaurant is currently closed. Please try again later.',
            });
            return;
        }

        setIsAddingToCart(true);
        let isConflictError = false;
        try {
            if (forceReplace) {
                await clearCart();
            }

            await addToCart({
                menu_item_id: menuItem.id,
                quantity: qty,
                selected_options: selectedOptions.map((opt) => ({
                    option_group: opt.option_group,
                    name: opt.name,
                    price_modifier: opt.price_modifier,
                })),
            });

            const ok = await confirm({
                title: "Success",
                message: "Item added to cart",
                confirmText: "View Cart",
                cancelText: "Continue Shopping",
            });

            if (ok) router.push("/cart");
            else router.back();
        } catch (error: any) {
            if (error.isConflict && error.response?.data) {
                isConflictError = true;
                const conflictData = error.response.data;
                const currentRestaurantName = conflictData.currentRestaurant?.name || "another restaurant";
                const newRestaurantName = conflictData.newRestaurant?.name || "this restaurant";

                const ok = await confirm({
                    title: "Replace Cart Items?",
                    message: `Your cart contains items from ${currentRestaurantName}. Do you want to clear your cart and add items from ${newRestaurantName} instead?`,
                    confirmText: "Replace Cart",
                    cancelText: "Cancel",
                    destructive: true,
                });

                if (!ok) {
                    setIsAddingToCart(false);
                    return;
                }

                await handleAddToCart(true);
                return;
            }
            showErrorAlert(error, "Failed to Add to Cart");
        } finally {
            if (!isConflictError) {
                setIsAddingToCart(false);
            }
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 bg-[#F9CF63] items-center justify-center">
                <ActivityIndicator size="large" color="#E95322" />
                <Text className="text-[#391713] mt-4">Loading menu item...</Text>
            </View>
        );
    }

    if (!menuItem) {
        return (
            <View className="flex-1 bg-[#F9CF63] items-center justify-center px-8">
                <Text className="text-[#391713] text-xl font-bold text-center">Menu item not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-[#E95322] px-6 py-3 rounded-full">
                    <Text className="text-white font-semibold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const discount =
        menuItem.original_price && menuItem.original_price > menuItem.price
            ? Math.round(
                  ((Number(menuItem.original_price) - Number(menuItem.price)) / Number(menuItem.original_price)) * 100
              )
            : 0;

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="pt-12 px-5 pb-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-back" size={24} color="#E95322" />
                    </TouchableOpacity>

                    <View className="flex-1 items-center">
                        <Text className="text-[#391713] text-lg font-extrabold" numberOfLines={1}>
                            {menuItem.name}
                        </Text>
                        {!menuItem.is_available && (
                            <Text className="text-red-600 text-xs font-semibold mt-1">Currently Unavailable</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => setIsFavorite(!isFavorite)}
                        className="w-10 h-10 rounded-full items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#E95322" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl px-5 pt-5 -mt-2">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
                    <View className="relative">
                        {menuItem.image_url ? (
                            <Image
                                source={{ uri: menuItem.image_url }}
                                className="w-full h-48 rounded-3xl"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-48 rounded-3xl bg-gray-200 items-center justify-center">
                                <Ionicons name="restaurant" size={48} color="#9CA3AF" />
                                <Text className="text-gray-500 mt-2">No Image</Text>
                            </View>
                        )}
                        {discount > 0 && (
                            <View className="absolute right-3 top-3 bg-[#E95322] rounded-full w-14 h-14 items-center justify-center">
                                <Text className="text-white text-lg font-bold">{discount}%</Text>
                            </View>
                        )}
                        {menuItem.is_featured && (
                            <View className="absolute left-3 top-3 bg-[#FFD700] rounded-full px-3 py-1">
                                <Text className="text-white text-xs font-bold">FEATURED</Text>
                            </View>
                        )}
                    </View>

                    <View className="flex-row items-center justify-between mt-4">
                        <View>
                            <View className="flex-row items-center">
                                <Text className="text-[#E95322] text-2xl font-extrabold">
                                    ${formatPrice(menuItem.price)}
                                </Text>
                                {menuItem.original_price &&
                                    parseNumeric(menuItem.original_price) > parseNumeric(menuItem.price) && (
                                        <Text className="text-[#9CA3AF] text-sm font-semibold line-through ml-2">
                                            ${formatPrice(menuItem.original_price)}
                                        </Text>
                                    )}
                            </View>
                        </View>

                        <View className="flex-row items-center bg-[#FFF5E6] rounded-full px-1 py-1">
                            <TouchableOpacity
                                onPress={() => setQty((q) => Math.max(1, q - 1))}
                                className="w-8 h-8 rounded-full bg-white items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="remove" size={16} color="#E95322" />
                            </TouchableOpacity>
                            <Text className="mx-3 text-[#391713] font-semibold text-base">{qty}</Text>
                            <TouchableOpacity
                                onPress={() => setQty((q) => q + 1)}
                                className="w-8 h-8 rounded-full bg-[#E95322] items-center justify-center"
                                activeOpacity={0.8}
                            >
                                <Ionicons name="add" size={16} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {menuItem.description && (
                        <View className="mt-4">
                            <Text className="text-[#391713] font-bold text-base">Description</Text>
                            <Text className="text-[#6B7280] text-sm mt-1 leading-5">{menuItem.description}</Text>
                        </View>
                    )}

                    {menuItem.preparation_time > 0 && (
                        <View className="mt-3 flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#6B7280" />
                            <Text className="text-[#6B7280] text-sm ml-2">
                                Preparation time: {menuItem.preparation_time} minutes
                            </Text>
                        </View>
                    )}

                    {menuItem.options && menuItem.options.length > 0 && (
                        <View className="mt-6">
                            {Array.from(new Set(menuItem.options.map((opt) => opt.option_group))).map(
                                (group, groupIdx) => {
                                    const groupOptions = menuItem.options!.filter((opt) => opt.option_group === group);

                                    return (
                                        <View key={groupIdx} className="mb-6">
                                            <Text className="text-[#391713] text-lg font-bold">{group}</Text>

                                            <View className="mt-3 rounded-2xl overflow-hidden border border-[#F2DFA2]">
                                                {groupOptions.map((option, idx) => {
                                                    const selected = isOptionSelected(option);
                                                    const priceText =
                                                        option.price_modifier === 0
                                                            ? "Included"
                                                            : option.price_modifier > 0
                                                            ? `+$${option.price_modifier}`
                                                            : `-$${Math.abs(option.price_modifier)}`;

                                                    return (
                                                        <View key={option.id}>
                                                            <TouchableOpacity
                                                                onPress={() => toggleOption(option)}
                                                                className="flex-row items-center justify-between px-4 py-3 bg-white"
                                                                activeOpacity={0.8}
                                                            >
                                                                <Text className="text-[#391713] text-sm flex-1">
                                                                    {option.name}
                                                                </Text>

                                                                <View className="flex-row items-center">
                                                                    <Text className="text-[#6B7280] text-sm mr-3">
                                                                        {priceText}
                                                                    </Text>
                                                                    <View
                                                                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                                                                            selected
                                                                                ? "border-[#E95322] bg-[#E95322]"
                                                                                : "border-[#D1D5DB]"
                                                                        }`}
                                                                    >
                                                                        {selected && (
                                                                            <View className="w-2 h-2 rounded-full bg-white" />
                                                                        )}
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {idx < groupOptions.length - 1 && (
                                                                <View className="h-px bg-[#F2DFA2]" />
                                                            )}
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    );
                                }
                            )}
                        </View>
                    )}
                </ScrollView>

                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-[#6B7280] text-sm">Total</Text>
                        <Text className="text-[#E95322] text-2xl font-extrabold">${calculateTotalPrice()}</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        className="rounded-full py-4 items-center flex-row justify-center"
                        style={{ backgroundColor: !menuItem.is_available || isAddingToCart ? "#9CA3AF" : "#E95322" }}
                        onPress={() => handleAddToCart()}
                        disabled={!menuItem.is_available || isAddingToCart}
                    >
                        {isAddingToCart ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="cart-outline" size={22} color="#fff" />
                                <Text className="text-white text-base font-semibold ml-2">
                                    {menuItem.is_available ? "Add to Cart" : "Unavailable"}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
