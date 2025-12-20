import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function PaymentMethodsScreen() {
    const router = useRouter();

    // Placeholder data - would come from API in production
    const paymentMethods = [
        {
            id: "1",
            type: "card",
            name: "Visa ending in 1234",
            icon: "credit-card",
            isDefault: true,
        },
        {
            id: "2",
            type: "card",
            name: "Mastercard ending in 5678",
            icon: "credit-card",
            isDefault: false,
        },
    ];

    const availablePaymentOptions = [
        { id: "cod", name: "Cash on Delivery", icon: "dollar-sign", description: "Pay when your order arrives" },
        { id: "wallet", name: "App Wallet", icon: "gift", description: "Use your app wallet balance" },
        { id: "momo", name: "MoMo", icon: "smartphone", description: "Pay with MoMo e-wallet" },
        { id: "vnpay", name: "VNPay", icon: "smartphone", description: "Pay with VNPay" },
    ];

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Payment Methods" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    <Text className="text-[#070707] font-bold text-base mb-3">Saved Cards</Text>
                    {paymentMethods.length > 0 ? (
                        <View className="mb-6">
                            {paymentMethods.map((method, index) => (
                                <View
                                    key={method.id}
                                    className="bg-[#FFF5D6] rounded-2xl p-4 mb-3 flex-row items-center justify-between"
                                >
                                    <View className="flex-row items-center flex-1">
                                        <View
                                            className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                            style={{ backgroundColor: "#FFE3D6" }}
                                        >
                                            <Feather name={method.icon as any} size={24} color="#E95322" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-[#070707] font-semibold">{method.name}</Text>
                                            {method.isDefault && (
                                                <Text className="text-[#E95322] text-xs mt-1">Default</Text>
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity className="p-2">
                                        <Feather name="more-vertical" size={20} color="#9CA3AF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View className="bg-[#FFF5D6] rounded-2xl p-6 mb-6 items-center">
                            <Feather name="credit-card" size={48} color="#9CA3AF" />
                            <Text className="text-[#6B7280] text-center mt-3">No saved cards yet</Text>
                            <Text className="text-[#9CA3AF] text-sm text-center mt-1">
                                Add a card for faster checkout
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        className="bg-[#E95322] rounded-full py-4 flex-row items-center justify-center mb-6"
                        activeOpacity={0.9}
                    >
                        <Feather name="plus" size={20} color="#FFFFFF" />
                        <Text className="text-white font-semibold ml-2">Add New Card</Text>
                    </TouchableOpacity>

                    <Text className="text-[#070707] font-bold text-base mb-3">Other Payment Options</Text>
                    <View className="bg-[#FFF5D6] rounded-2xl overflow-hidden">
                        {availablePaymentOptions.map((option, index) => (
                            <TouchableOpacity
                                key={option.id}
                                activeOpacity={0.7}
                                className="px-4 py-4 flex-row items-center"
                                style={{
                                    borderBottomWidth: index < availablePaymentOptions.length - 1 ? 1 : 0,
                                    borderBottomColor: "#FFE3D6",
                                }}
                            >
                                <View
                                    className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: "#FFE3D6" }}
                                >
                                    <Feather name={option.icon as any} size={24} color="#E95322" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-[#070707] font-semibold">{option.name}</Text>
                                    <Text className="text-[#6B7280] text-xs mt-1">{option.description}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="mt-6 bg-[#FFE3D6] rounded-2xl p-4">
                        <View className="flex-row items-start">
                            <Feather name="info" size={20} color="#E95322" />
                            <View className="flex-1 ml-3">
                                <Text className="text-[#070707] font-semibold">Secure Payments</Text>
                                <Text className="text-[#6B7280] text-sm mt-1">
                                    All payments are secured with industry-standard encryption
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
