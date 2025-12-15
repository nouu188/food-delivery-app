import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { EmptyOrder } from "@/assets/icons";

interface EmptyStateProps {
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <View style={styles.container}>
            <Image source={EmptyOrder} style={styles.icon} resizeMode="contain" />
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
        width: 120,
        height: 120,
        tintColor: "#FAD4D0",
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
