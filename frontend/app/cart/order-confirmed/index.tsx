// app/cart/order-confirmed/index.tsx
import AuthHeader from "@/components/ui/AuthHeader";
import { router } from "expo-router";
import { CheckCircle } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderConfirmedScreen() {
  return (
    <SafeAreaView className="flex-1 bg-yellow-400">
      <AuthHeader title="" />

      <View className="flex-1 items-center justify-center px-10">
        <View className="bg-white rounded-full p-16 mb-10 shadow-2xl">
          <CheckCircle size={140} color="#E95322" />
        </View>

        <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
          Order Confirmed!
        </Text>
        <Text className="text-xl text-gray-700 text-center mb-3">
          Your order has been placed successfully
        </Text>
        <Text className="text-lg text-gray-600 text-center mb-12">
          Delivery by Thu, 29th, 4:00 PM
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/cart/delivery-time")}
          className="bg-orange-500 px-10 py-5 rounded-full shadow-xl"
        >
          <Text className="text-white text-xl font-bold">Track my order</Text>
        </TouchableOpacity>

        <Text className="text-gray-600 text-center mt-10 text-sm px-8">
          If you have any questions, please reach out directly to our customer support
        </Text>
      </View>
    </SafeAreaView>
  );
}