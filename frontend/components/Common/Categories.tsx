import { DessertIcon, DrinksIcon, MealIcon, SnacksIcon, VeganIcon } from "@/assets/icons/index";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const CATEGORIES = [
    { key: "snacks", label: "Snacks", icon: SnacksIcon },
    { key: "meal", label: "Meal", icon: MealIcon },
    { key: "vegan", label: "Vegan", icon: VeganIcon },
    { key: "dessert", label: "Dessert", icon: DessertIcon },
    { key: "drinks", label: "Drinks", icon: DrinksIcon },
];

const Categories = () => {
    const [activeCategory, setActiveCategory] = React.useState("");
    return (
        <View className="px-5 pt-4">
            <View className="flex-row justify-between">
                {CATEGORIES.map((c) => {
                    const active = c.key === activeCategory;
                    return (
                        <TouchableOpacity
                            key={c.key}
                            onPress={() => setActiveCategory(c.key)}
                            activeOpacity={0.9}
                            className="items-center"
                        >
                            <View
                                className={`w-16 h-20 rounded-full ${
                                    active ? "bg-[#F5CB58]" : "bg-[#F3E9B5]"
                                } items-center justify-center`}
                            >
                                {typeof c.icon === "string" ? (
                                    <Image source={{ uri: c.icon }} className="w-10 h-10" resizeMode="contain" />
                                ) : (
                                    <c.icon width={40} height={40} />
                                )}
                            </View>
                            <Text className="mt-2 text-xs text-[#391713]">{c.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

export default Categories;
