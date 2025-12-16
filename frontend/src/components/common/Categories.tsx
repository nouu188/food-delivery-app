import { DessertIcon, DrinksIcon, MealIcon, SnacksIcon, VeganIcon } from "@/assets/icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native"; // Bỏ ScrollView
import { SvgProps } from "react-native-svg";

interface Category {
    id: string;
    name: string;
    Icon: React.FC<SvgProps>;
}

const CATEGORIES: Category[] = [
    { id: "snacks", name: "Snacks", Icon: SnacksIcon },
    { id: "meal", name: "Meal", Icon: MealIcon },
    { id: "vegan", name: "Vegan", Icon: VeganIcon },
    { id: "dessert", name: "Dessert", Icon: DessertIcon },
    { id: "drinks", name: "Drinks", Icon: DrinksIcon },
];

interface CategoriesProps {
    selectedCategory?: string;
    onSelectCategory?: (categoryId: string) => void;
    categories?: Category[];
}

const Categories: React.FC<CategoriesProps> = ({
    selectedCategory = "snacks",
    onSelectCategory,
    categories = CATEGORIES,
}) => {
    const [selected, setSelected] = React.useState(selectedCategory);

    const handleSelect = (categoryId: string) => {
        setSelected(categoryId);
        onSelectCategory?.(categoryId);
    };

    return (
        <View className="flex-row justify-between px-5 py-4 w-full">
            {categories.map((category) => {
                const isActive = selected === category.id;
                const Icon = category.Icon;

                return (
                    <View key={category.id}>
                        <TouchableOpacity onPress={() => handleSelect(category.id)} activeOpacity={0.8}>
                            <View className="items-center">
                                <View
                                    className="w-16 h-20 rounded-full items-center justify-center"
                                    style={{
                                        backgroundColor: isActive ? "#F5CB58" : "#F3E9B5",
                                    }}
                                >
                                    <Icon width={35} height={35} />
                                </View>
                                <Text className="text-xs font-semibold mt-2" style={{ color: "#391713" }}>
                                    {category.name}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
};

export default Categories;
