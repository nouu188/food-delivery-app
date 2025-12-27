import { DessertIcon, DrinksIcon, MealIcon, SnacksIcon, VeganIcon } from "@/assets/icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator, Image } from "react-native";
import { SvgProps } from "react-native-svg";
import restaurantService from "@/services/api/restaurant.service";
import { RestaurantCategory } from "@/types/api/restaurant";
import { useRouter } from "expo-router";

interface Category {
    id: string;
    name: string;
    Icon: React.FC<SvgProps>;
}

const FALLBACK_CATEGORIES: Category[] = [
    { id: "snacks", name: "Snacks", Icon: SnacksIcon },
    { id: "meal", name: "Meal", Icon: MealIcon },
    { id: "vegan", name: "Vegan", Icon: VeganIcon },
    { id: "dessert", name: "Dessert", Icon: DessertIcon },
    { id: "drinks", name: "Drinks", Icon: DrinksIcon },
];

const getCategoryIcon = (name: string): React.FC<SvgProps> | null => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("snack")) return SnacksIcon;
    if (lowerName.includes("meal") || lowerName.includes("food")) return MealIcon;
    if (lowerName.includes("vegan") || lowerName.includes("vegetarian")) return VeganIcon;
    if (lowerName.includes("dessert") || lowerName.includes("sweet")) return DessertIcon;
    if (lowerName.includes("drink") || lowerName.includes("beverage")) return DrinksIcon;
    return null;
};

interface CategoriesProps {
    selectedCategory?: string | null;
    onSelectCategory?: (categoryId: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ selectedCategory, onSelectCategory }) => {
    const router = useRouter();
    const [selected, setSelected] = useState<string | null>(selectedCategory || null);
    const [categories, setCategories] = useState<RestaurantCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (selectedCategory !== undefined) {
            setSelected(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const categoriesData = await restaurantService.getCategories();

            if (categoriesData && Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else {
                setCategories([]);
            }
        } catch (error) {
            console.error("Failed to load categories:", error);
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (categoryId: string) => {
        const newSelection = selected === categoryId ? null : categoryId;
        setSelected(newSelection);

        if (onSelectCategory) {
            onSelectCategory(newSelection);
        } else {
            router.push({
                pathname: "/Search",
                params: newSelection ? { category: newSelection } : {},
            });
        }
    };

    if (isLoading) {
        return (
            <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#E95322" />
            </View>
        );
    }

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <View className="py-4">
            <View className="px-5 mb-2">
                <Text className="text-[#391713] font-bold text-lg">Categories</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
                {categories.map((category) => {
                    const isActive = selected === category.id;
                    const Icon = getCategoryIcon(category.name);

                    return (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => handleSelect(category.id)}
                            activeOpacity={0.8}
                            className="items-center"
                            style={{ width: 80 }}
                        >
                            <View
                                className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                                style={{
                                    backgroundColor: isActive ? "#FFFFFF" : "#FFE3D6",
                                    borderWidth: isActive ? 2 : 0,
                                    borderColor: "#E95322",
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 4,
                                    elevation: 2,
                                }}
                            >
                                {category.icon_url ? (
                                    <Image
                                        source={{ uri: category.icon_url }}
                                        style={{ width: 32, height: 32, tintColor: "#E95322" }}
                                        resizeMode="contain"
                                    />
                                ) : Icon ? (
                                    <Icon width={32} height={32} color="#E95322" />
                                ) : (
                                    <View
                                        className="w-8 h-8 rounded-full items-center justify-center"
                                        style={{ backgroundColor: "#E95322" }}
                                    >
                                        <Text className="font-bold text-xs" style={{ color: "#FFFFFF" }}>
                                            {category.name.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text
                                className="text-xs font-semibold text-center"
                                style={{
                                    color: "#391713",
                                }}
                                numberOfLines={2}
                            >
                                {category.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default Categories;
