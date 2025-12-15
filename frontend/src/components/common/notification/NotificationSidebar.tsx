import React, { useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, Animated, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import NotificationItem from "./NotificationItem";
import { useNotificationStore } from "@/store/useNotificationStore";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.8;

interface NotificationSidebarProps {
    isVisible: boolean;
    onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isVisible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const notifications = useNotificationStore((state) => state.notifications);

    const openSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const closeSidebar = useCallback(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: SIDEBAR_WIDTH,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    useEffect(() => {
        if (isVisible) {
            openSidebar();
        } else {
            closeSidebar();
        }
    }, [isVisible, openSidebar, closeSidebar]);

    if (!isVisible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
            {/* Overlay */}
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Sidebar */}
            <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Feather name="bell" size={28} color="white" />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Notifi</Text>
                            <View style={styles.highlight}>
                                <Text style={[styles.title, styles.highlightText]}>cations</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.notificationList}>
                        {notifications.map((n) => (
                            <NotificationItem key={n.id} iconName={n.icon as any} text={n.message} />
                        ))}
                    </View>
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
        backgroundColor: "#E5634D",
        borderTopLeftRadius: 40,
        borderBottomLeftRadius: 40,
        paddingHorizontal: 25,
        paddingTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: -5, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    safeArea: { flex: 1 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 20,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    highlight: {
        backgroundColor: "#FFD34E",
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: -4,
        zIndex: -1,
    },
    highlightText: { color: "black" },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        width: "100%",
        marginBottom: 10,
    },
    notificationList: { flex: 1 },
});

export default NotificationSidebar;
