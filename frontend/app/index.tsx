import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Food Delivery App</Text>
            <Text style={styles.subtitle}>Welcome to our delicious world!</Text>

            <View style={styles.linkContainer}>
                <TouchableOpacity style={styles.button} onPress={() => router.push("/(tabs)")}>
                    <Text style={styles.buttonText}>Go to Main App</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/(auth)")}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => router.push("/(onboarding)")}>
                    <Text style={styles.buttonText}>Onboarding</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 30,
        textAlign: "center",
    },
    linkContainer: {
        gap: 15,
    },
    button: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});
