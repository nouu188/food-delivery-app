import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { usePaymentStore } from "@/store/usePaymentStore";

const iconForType = (type: string) => {
    switch (type) {
        case "apple":
            return "apple";
        case "paypal":
            return "credit-card";
        case "google":
            return "smartphone";
        default:
            return "credit-card";
    }
};

export default function PaymentMethodsScreen() {
    const router = useRouter();
    const { methods, selectedMethodId, selectMethod } = usePaymentStore();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Payment Methods" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <View className="pb-32">
                    {methods.map((m) => {
                        const active = m.id === selectedMethodId;
                        return (
                            <TouchableOpacity
                                key={m.id}
                                activeOpacity={0.8}
                                onPress={() => selectMethod(m.id)}
                                className="py-5 border-b"
                                style={{ borderBottomColor: "#FFD8C7" }}
                            >
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center flex-1">
                                        <Feather name={iconForType(m.type) as any} size={22} color="#E95322" />
                                        <Text className="ml-4 font-semibold text-[#070707]">{m.label}</Text>
                                    </View>

                                    <View
                                        className="w-4 h-4 rounded-full items-center justify-center"
                                        style={{ borderWidth: 1.5, borderColor: "#E95322" }}
                                    >
                                        {active && (
                                            <View
                                                className="w-2.5 h-2.5 rounded-full"
                                                style={{ backgroundColor: "#E95322" }}
                                            />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => router.push("/payment-methods/add-card")}
                        className="self-center mt-16 px-10 py-3 rounded-full"
                        style={{ backgroundColor: "#FFE3D6" }}
                    >
                        <Text className="text-[#E95322] font-semibold">Add New Card</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
