import { EmptyOrder } from "@/assets/icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
    message: string;
}

const ICON_SIZE = 120;

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <View style={styles.container}>
            <EmptyOrder width={ICON_SIZE} height={ICON_SIZE} style={styles.icon} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
        marginBottom: 30,
    },
    message: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#E5634D",
        textAlign: "center",
        lineHeight: 30,
    },
});

export default EmptyState;
