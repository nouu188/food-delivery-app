import { CartIcon, FavourIcon, UserIcon } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const RIGHT_ACTIONS = [
    { key: "cart", icon: CartIcon },
    { key: "bell", icon: FavourIcon },
    { key: "user", icon: UserIcon },
];

const SearchBar = () => {
    return (
        <View className="flex-row items-center gap-3 mt-8">
            {/* Search box */}
            <View className="flex-1 flex-row items-center bg-white rounded-full h-11 pl-3 pr-2">
                <Link href="/search" asChild>
                    <TouchableOpacity activeOpacity={0.8}>
                        <Ionicons name="search-outline" size={20} color="#9AA0A6" />
                    </TouchableOpacity>
                </Link>
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#9AA0A6"
                    className="flex-1 ml-2 text-base text-black"
                    returnKeyType="search"
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-9 h-9 rounded-full bg-[#F15A24] items-center justify-center"
                    onPress={() => router.push("/filter")}
                >
                    <Ionicons name="options-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Right actions */}
            {RIGHT_ACTIONS.map((a) => (
                <TouchableOpacity
                    key={a.key}
                    activeOpacity={0.7}
                    className="w-10 h-10 rounded-xl bg-white items-center justify-center"
                >
                    <Ionicons
                        name={
                            a.key === "cart"
                                ? "cart-outline"
                                : a.key === "bell"
                                  ? "notifications-outline"
                                  : "person-outline"
                        }
                        size={20}
                        color="#F15A24"
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default SearchBar;
