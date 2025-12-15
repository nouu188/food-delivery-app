import React from "react";
import { TouchableOpacity, TextInput, View } from "react-native";
import { Search, SlidersHorizontal, XCircle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";

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
            <TouchableOpacity onPress={() => router.push("/(main)/(tabs)/Search")} activeOpacity={0.7}>
                <View className="bg-white rounded-full h-12 flex-row items-center px-4">
                    <Search size={20} color="#9CA3AF" />
                    <View className="flex-1 ml-3">
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            editable={false}
                            style={{
                                fontSize: 14,
                                color: "#151312",
                                fontWeight: "400",
                            }}
                        />
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                        <SlidersHorizontal size={20} color="#E95322" />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
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
            <TouchableOpacity onPress={() => router.push("/(main)/(tabs)/Filter")} activeOpacity={0.7}>
                <SlidersHorizontal size={20} color="#E95322" />
            </TouchableOpacity>
        </View>
    );
};

export default SearchBar;
