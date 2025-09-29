import { categories } from "@/constants/icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const CATEGORIES = [
    { key: "snacks", label: "Snacks", icon: categories.snack },
    { key: "meal", label: "Meal", icon: categories.meals },
    { key: "vegan", label: "Vegan", icon: categories.vegan },
    { key: "dessert", label: "Dessert", icon: categories.desserts },
    { key: "drinks", label: "Drinks", icon: categories.drinks },
];

const Categories = () => {
    const [activeCategory, setActiveCategory] = React.useState("");
    return (
        <View className="px-5 pt-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
                {CATEGORIES.map((c) => {
                    const active = c.key === activeCategory;
                    return (
                        <TouchableOpacity
                            key={c.key}
                            onPress={() => setActiveCategory(c.key)}
                            activeOpacity={0.9}
                            className={`mx-1 items-center`}
                        >
                            <View
                                className={`w-16 h-16 rounded-2xl border ${
                                    active ? "bg-[#F9E6A8] border-[#F15A24]" : "bg-white border-[#F2DFA2]"
                                } items-center justify-center`}
                                style={{
                                    shadowColor: "#000",
                                    shadowOpacity: 0.08,
                                    shadowRadius: 6,
                                    elevation: 2,
                                }}
                            >
                                {typeof c.icon === "string" ? (
                                    <Image source={{ uri: c.icon }} className="w-8 h-8" resizeMode="contain" />
                                ) : (
                                    <Image source={c.icon} className="w-8 h-8" resizeMode="contain" />
                                )}
                            </View>
                            <Text className={`mt-1 ${active ? "text-[#391713] font-semibold" : "text-[#391713]"}`}>
                                {c.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default Categories;
