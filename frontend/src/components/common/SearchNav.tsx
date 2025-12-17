import { BellIcon, CartIcon, UserIcon } from "@/assets/icons";
import { SearchBar } from "@/components/common";
import { useOrderStore } from "@/store/useOrderStore";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface SearchNavProps {
    onNotificationPress: () => void;
    onProfilePress: () => void;
}

const SearchNav: React.FC<SearchNavProps> = ({ onNotificationPress, onProfilePress }) => {
    const router = useRouter();
    const firstOrderId = useOrderStore((s) => s.orders[0]?.id);

    return (
        <View className="flex-row items-center">
            {/* Search Bar Section */}
            <View className="flex-1">
                <SearchBar isSearchPage={false} />
            </View>

            {/* Action Buttons Section */}
            <View className="flex-row items-center gap-3 ml-3">
                {/* Cart Button */}
                <TouchableOpacity
                    onPress={() => router.push(`/order-details/${firstOrderId ?? "1"}`)}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <CartIcon width={22} height={22} />
                </TouchableOpacity>

                {/* Notification Button */}
                <TouchableOpacity
                    onPress={onNotificationPress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <BellIcon width={22} height={22} />
                </TouchableOpacity>

                {/* Profile Button */}
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
