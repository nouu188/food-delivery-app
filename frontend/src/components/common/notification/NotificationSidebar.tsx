import { useNotificationStore } from "@/store/useNotificationStore";
import { NotificationType } from "@/types/api/notification";
import { Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, Animated, Dimensions, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationItem from "./NotificationItem";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.8;

const getIconForNotificationType = (type: NotificationType): React.ComponentProps<typeof Feather>["name"] => {
    switch (type) {
        case NotificationType.ORDER_UPDATE:
            return 'shopping-bag';
        case NotificationType.PAYMENT_CONFIRMATION:
            return 'credit-card';
        case NotificationType.DELIVERY_STATUS:
            return 'truck';
        case NotificationType.PROMOTION:
            return 'gift';
        case NotificationType.REVIEW_REPLY:
            return 'message-circle';
        case NotificationType.SYSTEM_ANNOUNCEMENT:
            return 'bell';
        default:
            return 'bell';
    }
};

interface NotificationSidebarProps {
    isVisible: boolean;
    onClose: () => void;
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isVisible, onClose }) => {
    const slideAnim = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { notifications: rawNotifications, isLoading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();

    const notifications = Array.isArray(rawNotifications) ? rawNotifications : [];

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
            fetchNotifications();
        } else {
            closeSidebar();
        }
    }, [isVisible, openSidebar, closeSidebar]);

    const handleNotificationPress = async (id: string, isRead: boolean) => {
        if (!isRead) {
            await markAsRead(id);
        }
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    if (!isVisible) return null;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="auto">
            <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <Animated.View style={[styles.sidebarContainer, { transform: [{ translateX: slideAnim }] }]}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <Feather name="bell" size={28} color="white" />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Notifications</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Feather name="x" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    {notifications.length > 0 && (
                        <TouchableOpacity onPress={handleMarkAllAsRead} style={styles.markAllButton}>
                            <Text style={styles.markAllText}>Mark all as read</Text>
                        </TouchableOpacity>
                    )}
                    <View style={styles.divider} />

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FFFFFF" />
                            <Text style={styles.loadingText}>Loading notifications...</Text>
                        </View>
                    ) : notifications.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Feather name="bell-off" size={48} color="rgba(255, 255, 255, 0.5)" />
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    ) : (
                        <ScrollView style={styles.notificationList} showsVerticalScrollIndicator={false}>
                            {notifications.map((n) => (
                                <NotificationItem
                                    key={n.id}
                                    iconName={getIconForNotificationType(n.type)}
                                    title={n.title}
                                    text={n.message}
                                    isRead={n.is_read}
                                    onPress={() => handleNotificationPress(n.id, n.is_read)}
                                />
                            ))}
                        </ScrollView>
                    )}
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
        paddingHorizontal: 25,
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
        marginBottom: 10,
    },
    titleContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    markAllButton: {
        alignSelf: "flex-end",
        marginVertical: 10,
    },
    markAllText: {
        color: "#FFD34E",
        fontSize: 14,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        width: "100%",
        marginBottom: 10,
    },
    notificationList: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },
    loadingText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 14,
        marginTop: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
    },
    emptyText: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 16,
        marginTop: 16,
    },
});

export default NotificationSidebar;
