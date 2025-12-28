import { BellIcon, CartIcon, UserIcon } from "@/assets/icons";
import SearchBar from "./SearchBar";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SearchNavProps {
    onNotificationPress: () => void;
    onProfilePress: () => void;
}

interface BadgeProps {
    count: number;
    backgroundColor?: string;
}

const Badge: React.FC<BadgeProps> = React.memo(({ count, backgroundColor = "#E95322" }) => {
    if (count <= 0) return null;

    return (
        <View
            className="absolute -top-1 -right-1 rounded-full min-w-[20px] h-5 items-center justify-center px-1"
            style={{ backgroundColor }}
        >
            <Text className="text-white text-xs font-bold">
                {count > 99 ? '99+' : count}
            </Text>
        </View>
    );
});

Badge.displayName = 'Badge';

const SearchNav: React.FC<SearchNavProps> = ({ onNotificationPress, onProfilePress }) => {
    const cart = useCartStore((s) => s.cart);
    const openCartDrawer = useCartStore((s) => s.openDrawer);
    const notifications = useNotificationStore((s) => s.notifications);

    const itemCount = React.useMemo(() => {
        if (!cart?.items || !Array.isArray(cart.items)) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart?.items]);

    const unreadCount = React.useMemo(() => {
        if (!Array.isArray(notifications)) return 0;
        return notifications.filter(n => !n.is_read).length;
    }, [notifications]);

    const handleCartPress = useCallback(() => {
        openCartDrawer();
    }, [openCartDrawer]);

    const handleNotificationPress = useCallback(() => {
        onNotificationPress();
    }, [onNotificationPress]);

    const handleProfilePress = useCallback(() => {
        onProfilePress();
    }, [onProfilePress]);

    return (
        <View className="flex-row items-center">
            <View className="flex-1">
                <SearchBar isSearchPage={false} />
            </View>

            <View className="flex-row items-center gap-3 ml-3">
                <TouchableOpacity
                    onPress={handleCartPress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <CartIcon width={22} height={22} />
                    <Badge count={itemCount} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNotificationPress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <BellIcon width={22} height={22} />
                    <Badge count={unreadCount} backgroundColor="#DC2626" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleProfilePress}
                    activeOpacity={0.75}
                    className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm"
                >
                    <UserIcon width={22} height={22} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

SearchNav.displayName = 'SearchNav';

export default React.memo(SearchNav);
