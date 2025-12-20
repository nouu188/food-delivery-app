import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function SettingsScreen() {
    const router = useRouter();

    const [pushNotifications, setPushNotifications] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotions, setPromotions] = useState(true);

    const settingsSections = [
        {
            title: "Notifications",
            items: [
                {
                    label: "Push Notifications",
                    description: "Receive push notifications on your device",
                    value: pushNotifications,
                    onToggle: setPushNotifications,
                },
                {
                    label: "Email Notifications",
                    description: "Receive notifications via email",
                    value: emailNotifications,
                    onToggle: setEmailNotifications,
                },
                {
                    label: "SMS Notifications",
                    description: "Receive notifications via SMS",
                    value: smsNotifications,
                    onToggle: setSmsNotifications,
                },
            ],
        },
        {
            title: "Order Preferences",
            items: [
                {
                    label: "Order Updates",
                    description: "Get notified about order status changes",
                    value: orderUpdates,
                    onToggle: setOrderUpdates,
                },
                {
                    label: "Promotions & Offers",
                    description: "Receive promotional offers and discounts",
                    value: promotions,
                    onToggle: setPromotions,
                },
            ],
        },
    ];

    const accountOptions = [
        {
            icon: "user" as const,
            label: "Edit Profile",
            onPress: () => router.push("/Profile"),
        },
        {
            icon: "map-pin" as const,
            label: "Delivery Addresses",
            onPress: () => router.push("/delivery-address"),
        },
        {
            icon: "credit-card" as const,
            label: "Payment Methods",
            onPress: () => router.push("/payment-methods"),
        },
        {
            icon: "help-circle" as const,
            label: "Help & Support",
            onPress: () => router.push("/help"),
        },
        {
            icon: "info" as const,
            label: "About",
            onPress: () => {},
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="Settings" />

            <View className="flex-1 bg-white rounded-t-3xl px-6 pt-6">
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                    {settingsSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} className="mb-6">
                            <Text className="text-[#070707] font-bold text-base mb-3">{section.title}</Text>
                            <View className="bg-[#FFF5D6] rounded-2xl overflow-hidden">
                                {section.items.map((item, itemIndex) => (
                                    <View
                                        key={itemIndex}
                                        className="px-4 py-4 flex-row items-center justify-between"
                                        style={{
                                            borderBottomWidth: itemIndex < section.items.length - 1 ? 1 : 0,
                                            borderBottomColor: "#FFE3D6",
                                        }}
                                    >
                                        <View className="flex-1 pr-4">
                                            <Text className="text-[#070707] font-semibold">{item.label}</Text>
                                            <Text className="text-[#6B7280] text-xs mt-1">{item.description}</Text>
                                        </View>
                                        <Switch
                                            value={item.value}
                                            onValueChange={item.onToggle}
                                            trackColor={{ false: "#E5E7EB", true: "#FFE3D6" }}
                                            thumbColor={item.value ? "#E95322" : "#9CA3AF"}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    <Text className="text-[#070707] font-bold text-base mb-3">Account</Text>
                    <View className="bg-[#FFF5D6] rounded-2xl overflow-hidden">
                        {accountOptions.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={option.onPress}
                                className="px-4 py-4 flex-row items-center justify-between"
                                style={{
                                    borderBottomWidth: index < accountOptions.length - 1 ? 1 : 0,
                                    borderBottomColor: "#FFE3D6",
                                }}
                            >
                                <View className="flex-row items-center flex-1">
                                    <View
                                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: "#FFE3D6" }}
                                    >
                                        <Feather name={option.icon} size={20} color="#E95322" />
                                    </View>
                                    <Text className="text-[#070707] font-semibold">{option.label}</Text>
                                </View>
                                <Feather name="chevron-right" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="mt-8 items-center">
                        <Text className="text-[#9CA3AF] text-sm">App Version 1.0.0</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}
