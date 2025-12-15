import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { LayoutGrid, Pizza, Beef, IceCream, Coffee, Salad, Dessert } from "@tamagui/lucide-icons";

interface Category {
    id: string;
    name: string;
    icon: typeof LayoutGrid;
}

const CATEGORIES: Category[] = [
    { id: "all", name: "All", icon: LayoutGrid },
    { id: "pizza", name: "Pizza", icon: Pizza },
    { id: "burger", name: "Burger", icon: Beef },
    { id: "dessert", name: "Dessert", icon: IceCream },
    { id: "drinks", name: "Drinks", icon: Coffee },
    { id: "salad", name: "Salad", icon: Salad },
    { id: "snacks", name: "Snacks", icon: Dessert },
];

interface CategoriesProps {
    /**
     * Currently selected category ID
     */
    selectedCategory?: string;

    /**
     * Callback when category is selected
     */
    onSelectCategory?: (categoryId: string) => void;

    /**
     * Custom categories array
     */
    categories?: Category[];
}

/**
 * Horizontal scrollable categories component
 * Displays category buttons with icons
 */
const Categories: React.FC<CategoriesProps> = ({
    selectedCategory = "all",
    onSelectCategory,
    categories = CATEGORIES,
}) => {
    const [selected, setSelected] = React.useState(selectedCategory);

    const handleSelect = (categoryId: string) => {
        setSelected(categoryId);
        onSelectCategory?.(categoryId);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
        >
            <View className="flex-row">
                {categories.map((category, index) => {
                    const isActive = selected === category.id;
                    const IconComponent = category.icon;

                    return (
                        <View key={category.id} className={index === categories.length - 1 ? "" : "mr-3"}>
                            <TouchableOpacity onPress={() => handleSelect(category.id)} activeOpacity={0.7}>
                                <View
                                    className={
                                        isActive
                                            ? "bg-OrangeBase rounded-[20px] px-4 py-2.5 items-center justify-center min-w-[80px]"
                                            : "bg-white rounded-[20px] px-4 py-2.5 items-center justify-center min-w-[80px]"
                                    }
                                    style={{
                                        shadowColor: "#000",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 4,
                                        elevation: 2,
                                    }}
                                >
                                    <IconComponent size={24} color={isActive ? "white" : "#E95322"} />
                                    <Text
                                        className={
                                            isActive
                                                ? "text-white text-xs font-semibold mt-1"
                                                : "text-Font text-xs font-semibold mt-1"
                                        }
                                    >
                                        {category.name}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default Categories;
