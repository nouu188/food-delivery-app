import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

interface NotificationItemProps {
    iconName: React.ComponentProps<typeof Feather>["name"];
    text: string;
    title?: string;
    isRead?: boolean;
    onPress?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    iconName,
    text,
    title,
    isRead = false,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, !isRead && styles.unreadContainer]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.iconContainer}>
                <Feather name={iconName} size={24} color="#E5634D" />
            </View>
            <View style={styles.textContainer}>
                {title && <Text style={styles.title}>{title}</Text>}
                <Text style={styles.text} numberOfLines={2}>{text}</Text>
            </View>
            {!isRead && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255, 255, 255, 0.2)",
    },
    unreadContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
        paddingRight: 10,
    },
    title: {
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "700",
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "500",
    },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#FFD34E",
    },
});

export default NotificationItem;
