import { CartIcon, UserIcon } from "@/assets/icons";
import { Categories } from "@/components/common";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Star } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const RIGHT_ACTIONS = [
    { key: "cart", icon: CartIcon },
    { key: "user", icon: UserIcon },
];

const FOOD_TAGS = [
    "Bruschetta",
    "Spring Rolls",
    "Crepes",
    "Wings",
    "Skewers",
    "Salmon",
    "Mexican",
    "Baked",
    "Appetizer",
];

const Filter = () => {
    const [, setRating] = React.useState(4);
    const [selectedTags, setSelectedTags] = React.useState<string[]>(["Skewers", "Salmon"]);
    const [price, setPrice] = React.useState(10);

    const toggleTag = (tag: string) =>
        setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

    return (
        <View className="flex-1 bg-[#F9CF63]">
            <View className="px-8 pt-16 pb-14">
                <View className="flex-row items-center gap-3 justify-between">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3" activeOpacity={0.7}>
                        <Ionicons name="chevron-back-outline" size={20} color="#E95322" />
                    </TouchableOpacity>

                    <View>
                        <Text className="text-3xl font-bold text-white">Filter</Text>
                    </View>

                    <View className="flex-row items-center gap-3">
                        {RIGHT_ACTIONS.map((a) => (
                            <TouchableOpacity
                                key={a.key}
                                activeOpacity={0.7}
                                className="w-10 h-10 rounded-xl bg-white items-center justify-center"
                            >
                                <a.icon />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

            <View className="flex-1 bg-white rounded-t-3xl pl-5 pt-5 -mt-3">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
                    <Text className="text-2xl font-semibold text-[#391713] px-1">Categories</Text>
                    <View className="-ml-5">
                        <Categories />
                    </View>
                    <View className="h-px bg-[#F2DFA2] mt-3" />

                    <View className="mt-4">
                        <Text className="text-2xl font-semibold text-[#391713] px-1">Sort by</Text>
                        <View className="mt-2 px-1 flex-row items-center gap-4">
                            <Text className="text-[#6B7280]">Top Rated</Text>
                            <View className="flex-row">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        onPress={() => setRating(i + 1)}
                                        activeOpacity={1}
                                        className="mr-1"
                                    >
                                        <Star size={25} color="#E95322" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View className="h-px bg-[#F2DFA2] mt-4" />
                    </View>

                    <View className="mt-4">
                        <Text className="text-2xl font-semibold text-[#391713] px-1">Categories</Text>
                        <View className="flex-row flex-wrap gap-2 mt-3">
                            {FOOD_TAGS.map((tag) => {
                                const active = selectedTags.includes(tag);
                                return (
                                    <TouchableOpacity
                                        key={tag}
                                        onPress={() => toggleTag(tag)}
                                        activeOpacity={0.8}
                                        className={`px-4 py-2 rounded-full ${active ? "bg-[#E95322]" : "bg-[#FFE3D6]"}`}
                                    >
                                        <Text className={`${active ? "text-white" : "text-[#E95322]"} font-semibold`}>
                                            {tag}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        <View className="h-px bg-[#F2DFA2] mt-4" />
                    </View>

                    <View className="mt-4">
                        <Text className="text-lg font-semibold text-[#E95322] px-1">Price</Text>
                        <View className="mt-4 px-1 pr-5">
                            <Slider
                                style={{ height: 80 }}
                                minimumValue={1}
                                maximumValue={100}
                                step={1}
                                value={price}
                                onValueChange={(v: number | number[]) => setPrice(Array.isArray(v) ? v[0] : v)}
                                minimumTrackTintColor="#E95322"
                                maximumTrackTintColor="#E5E7EB"
                                thumbTintColor="#E95322"
                            />
                            <View className="flex-row justify-between mt-2 pl-5">
                                <Text className="text-[#391713]">$1</Text>
                                <Text className="text-[#391713]">$10</Text>
                                <Text className="text-[#391713]">$50</Text>
                                <Text className="text-[#391713]">$100 &gt;</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-[#E95322] rounded-full items-center mt-16 mb-2 self-center px-20  py-3"
                        activeOpacity={0.8}
                        onPress={() => {
                            router.push("/(main)/(tabs)/Search");
                        }}
                    >
                        <Text className="text-white text-lg font-semibold">Apply</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
};

export default Filter;
