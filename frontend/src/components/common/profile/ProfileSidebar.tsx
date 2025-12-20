import { useUserStore } from "@/store/useUserStore";
import LogoutModal from "@/components/common/LogoutModal";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.82;

interface ProfileSidebarProps {
    isVisible: boolean;
    onClose: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ isVisible, onClose }) => {
    const router = useRouter();
    const { profile } = useUserStore();
    const [logoutVisible, setLogoutVisible] = React.useState(false);

    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const openSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const closeSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: SIDEBAR_WIDTH,
                duration: 280,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 280,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (isVisible) openSidebar();
        else closeSidebar();
    }, [isVisible, openSidebar, closeSidebar]);

    const menuItems = useMemo<Array<{
        key: string;
        icon: React.ComponentProps<typeof Feather>['name'];
        label: string;
        onPress: () => void;
    }>>(
        () => [
            {
                key: "orders",
                icon: "shopping-bag",
                label: "My Orders",
                onPress: () => router.push("/orders/index"),
            },
            { key: "profile", icon: "user", label: "My Profile", onPress: () => router.push("/Profile") },
            {
                key: "address",
                icon: "map-pin",
                label: "Delivery Address",
                onPress: () => router.push("/delivery-address"),
            },
            {
                key: "payment",
                icon: "credit-card",
                label: "Payment Methods",
                onPress: () => router.push("/payment-methods"),
            },
            { key: "contact", icon: "phone", label: "Contact Us", onPress: () => router.push("/Contact") },
            { key: "help", icon: "message-circle", label: "Help & FAQs", onPress: () => router.push("/help") },
            { key: "settings", icon: "settings", label: "Settings", onPress: () => router.push("/settings") },
        ],
        [router]
    );

    const handleItemPress = (fn: () => void) => {
        onClose();
        requestAnimationFrame(() => fn());
    };

    if (!isVisible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.topRow}>
                        <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.backButton}>
                            <Feather name="chevron-right" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.profileHeader}>
                        {profile?.avatar_url ? (
                            <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, { backgroundColor: '#e0e0e0' }]} />
                        )}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name} numberOfLines={1}>
                                {profile?.full_name || 'User'}
                            </Text>
                            <Text style={styles.email} numberOfLines={1}>
                                {profile?.email || ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.menuList}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.key}
                                activeOpacity={0.8}
                                onPress={() => handleItemPress(item.onPress)}
                                style={styles.menuRow}
                            >
                                <View style={styles.menuIconBox}>
                                    <Feather name={item.icon} size={22} color="#E5634D" />
                                </View>
                                <Text style={styles.menuText}>{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setLogoutVisible(true)}
                        style={styles.logoutRow}
                    >
                        <View style={styles.logoutIconBox}>
                            <Feather name="log-out" size={20} color="#E5634D" />
                        </View>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>

                    <LogoutModal
                        visible={logoutVisible}
                        onCancel={() => setLogoutVisible(false)}
                        onConfirm={() => {
                            setLogoutVisible(false);
                            onClose();
                            requestAnimationFrame(() => router.replace("/(auth)/Login"));
                        }}
                    />
                </SafeAreaView>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    sidebarContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: "#E95322",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        paddingHorizontal: 24,
        shadowColor: "#000",
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 10,
    },
    safeArea: { flex: 1 },
    topRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingTop: 8,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
        marginBottom: 18,
        gap: 14,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.9)",
    },
    name: {
        fontSize: 28,
        fontWeight: "800",
        color: "#FFFFFF",
        lineHeight: 30,
    },
    email: {
        marginTop: 2,
        fontSize: 12,
        color: "rgba(255,255,255,0.85)",
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        width: "100%",
    },
    menuList: {
        paddingVertical: 10,
    },
    menuRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.18)",
    },
    menuIconBox: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    menuText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "600",
    },
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 18,
    },
    logoutIconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    logoutText: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "700",
    },
});

export default ProfileSidebar;
