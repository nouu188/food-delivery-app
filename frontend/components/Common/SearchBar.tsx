import { BellIcon, CartIcon, HomeIcon, UserIcon } from "@/assets/icons/index";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

const RIGHT_ACTIONS = [
    { key: "cart", icon: CartIcon },
    { key: "bell", icon: BellIcon },
    { key: "user", icon: UserIcon },
];

interface SearchBarProps {
    isSearchPage: boolean;
}

const SearchBar = ({ isSearchPage }: SearchBarProps) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const handleSearch = () => {
        router.push(`/search`);
    };

    return (
        <View className="flex-row items-center gap-3 mt-8">
            {/* Search box */}
            <View className="flex-1 flex-row items-center bg-white rounded-full h-11 pl-3 pr-2">
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#9AA0A6"
                    className="flex-1 ml-2 text-base text-black"
                    returnKeyType="search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-9 h-9 rounded-full bg-[#E95322] items-center justify-center"
                    onPress={() => router.push("/filter")}
                >
                    <Ionicons name="options-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {/* Right actions */}
            {!isSearchPage ? (
                RIGHT_ACTIONS.map((a) => (
                    <TouchableOpacity
                        key={a.key}
                        activeOpacity={0.7}
                        className="w-10 h-10 rounded-xl bg-white items-center justify-center"
                    >
                        <a.icon />
                    </TouchableOpacity>
                ))
            ) : (
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-10 h-10 bg-[#E8B931] rounded-xl items-center justify-center"
                    onPress={() => router.push("/home")}
                >
                    <HomeIcon />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default SearchBar;
