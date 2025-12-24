import { BellIcon, CartIcon, UserIcon } from "@/assets/icons";
import { SearchBar } from "@/components/common";
import { useCartStore } from "@/store/useCartStore";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface SearchNavProps {
    onNotificationPress: () => void;
    onProfilePress: () => void;
}

const SearchNav: React.FC<SearchNavProps> = ({ onNotificationPress, onProfilePress }) => {
    const openCartDrawer = useCartStore((s) => s.openDrawer);

    return (
        <View className="flex-row items-center">
            <View className="flex-1">
                <SearchBar isSearchPage={false} />
            </View>

            <View className="flex-row items-center gap-3 ml-3">
                <TouchableOpacity
                    onPress={openCartDrawer}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <CartIcon width={22} height={22} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onNotificationPress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <BellIcon width={22} height={22} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onProfilePress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <UserIcon width={22} height={22} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SearchNav;
