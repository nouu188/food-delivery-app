import { Search, SlidersHorizontal, XCircle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
    isSearchPage?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    isSearchPage = false,
    value = "",
    onChangeText,
    placeholder = "Search for food...",
}) => {
    const router = useRouter();
    const [searchText, setSearchText] = React.useState(value);

    const handleChangeText = (text: string) => {
        setSearchText(text);
        onChangeText?.(text);
    };

    if (!isSearchPage) {
        return (
            <View className="bg-white rounded-full h-12 flex-row items-center px-4">
                <TouchableOpacity
                    onPress={() => router.push("/(main)/(screens)/Search")}
                    activeOpacity={0.7}
                    className="flex-1 flex-row items-center"
                >
                    <Search size={20} color="#9CA3AF" />
                    <View className="flex-1 ml-3">
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            editable={false}
                            pointerEvents="none"
                            numberOfLines={1}
                            style={{
                                fontSize: 14,
                                color: "#151312",
                                fontWeight: "400",
                            }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push("/(main)/(screens)/Filter")}
                    activeOpacity={0.8}
                    className="w-8 h-8 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#E95322" }}
                >
                    <SlidersHorizontal size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-full h-12 flex-row items-center px-4">
            <Search size={20} color="#9CA3AF" />
            <View className="flex-1 ml-3">
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={searchText}
                    onChangeText={handleChangeText}
                    autoFocus
                    numberOfLines={1}
                    maxLength={50}
                    style={{
                        fontSize: 14,
                        color: "#151312",
                        fontWeight: "400",
                        flex: 1,
                    }}
                />
            </View>
            {searchText.length > 0 && (
                <TouchableOpacity onPress={() => handleChangeText("")} activeOpacity={0.7}>
                    <XCircle size={20} color="#9CA3AF" />
                </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.push("/(main)/(screens)/Filter")} activeOpacity={0.7}>
                <SlidersHorizontal size={20} color="#E95322" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;
