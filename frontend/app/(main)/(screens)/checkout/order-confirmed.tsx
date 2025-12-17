import Header from "@/components/common/Header";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderConfirmedScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-YellowBase">
            <Header title="" showBackButton={true} />

            <View className="flex-1 items-center justify-center px-10">
                <View
                    className="w-40 h-40 rounded-full items-center justify-center"
                    style={{ borderWidth: 4, borderColor: "#E95322" }}
                >
                    <View className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E95322" }} />
                </View>

                <Text className="mt-10 text-2xl font-extrabold text-[#070707]">iOrder Confirmed!</Text>
                <Text className="mt-2 text-center text-[#6B7280] font-semibold">
                    Your order has been successfully{`\n`}placed
                </Text>

                <Text className="mt-6 text-center text-[#6B7280]">Delivery by Thu, 29th, 4:00 PM</Text>

                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => router.push("/checkout/delivery-time")}
                    className="mt-8 px-10 py-3 rounded-full"
                    style={{ backgroundColor: "#FFE3D6" }}
                >
                    <Text className="text-[#E95322] font-semibold">Track my order</Text>
                </TouchableOpacity>

                <Text className="mt-16 text-center text-[#6B7280]">
                    If you have any questions, please reach out{`\n`}directly to our customer support
                </Text>
            </View>
        </SafeAreaView>
    );
}
