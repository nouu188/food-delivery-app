import Header from "@/components/common/Header";
import LogoutModal from "@/components/common/LogoutModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const ROWS = [
    { key: "profile", label: "My Profile", icon: "user" },
    { key: "address", label: "Delivery Address", icon: "map-pin" },
    { key: "payment", label: "Payment Methods", icon: "credit-card" },
    { key: "help", label: "Help & FAQs", icon: "help-circle" },
];

export default function SettingsScreen() {
    const router = useRouter();
    const { logout } = useLocalSearchParams<{ logout?: string }>();
    const [logoutVisible, setLogoutVisible] = React.useState(false);

    React.useEffect(() => {
        if (logout === "1") setLogoutVisible(true);
    }, [logout]);

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Settings" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                {ROWS.map((r) => (
                    <TouchableOpacity
                        key={r.key}
                        activeOpacity={0.8}
                        className="py-5 border-b flex-row items-center"
                        style={{ borderBottomColor: "#FFD8C7" }}
                        onPress={() => {
                            if (r.key === "profile") router.push("/Profile");
                            if (r.key === "address") router.push("/delivery-address");
                            if (r.key === "payment") router.push("/payment-methods");
                            if (r.key === "help") router.push("/help");
                        }}
                    >
                        <View
                            className="w-12 h-12 rounded-2xl items-center justify-center"
                            style={{ backgroundColor: "#FFE3D6" }}
                        >
                            <Feather name={r.icon as any} size={20} color="#E95322" />
                        </View>
                        <Text className="ml-4 font-semibold text-[#070707] flex-1">{r.label}</Text>
                        <Feather name="chevron-right" size={18} color="#E95322" />
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => setLogoutVisible(true)}
                    className="mt-8 flex-row items-center justify-center py-4 rounded-full"
                    style={{ backgroundColor: "#FFE3D6" }}
                >
                    <Feather name="log-out" size={18} color="#E95322" />
                    <Text className="ml-3 text-[#E95322] font-semibold">Log Out</Text>
                </TouchableOpacity>

                <LogoutModal
                    visible={logoutVisible}
                    onCancel={() => setLogoutVisible(false)}
                    onConfirm={() => {
                        setLogoutVisible(false);
                        router.replace("/(auth)/Login");
                    }}
                />
            </View>
        </SafeAreaView>
    );
}
