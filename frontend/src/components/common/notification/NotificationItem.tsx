import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons"; // Hoặc một bộ icon khác bạn thích

// Định nghĩa props cho component
interface NotificationItemProps {
    iconName: React.ComponentProps<typeof Feather>["name"]; // Lấy kiểu tên icon từ Feather
    text: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ iconName, text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <Feather name={iconName} size={24} color="#E5634D" />
            </View>
            <Text style={styles.text}>{text}</Text>
        </View>
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
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    text: {
        flex: 1, // Để text tự động xuống dòng nếu dài
        fontSize: 16,
        color: "#FFFFFF",
        fontWeight: "500",
    },
});

export default NotificationItem;
