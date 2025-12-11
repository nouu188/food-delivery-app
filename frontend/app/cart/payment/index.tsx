// app/cart/payment/index.tsx
import AuthHeader from "@/components/ui/AuthHeader";
import { useCartStore } from "@/store/useCartStore";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen() {
  const { items, getTotal } = useCartStore();

  return (
    <SafeAreaView className="flex-1 bg-orange-500">
      <AuthHeader title="Payment" />

      <View className="flex-1 bg-white rounded-t-[40px] px-6 pt-6">
        {/* Shipping Address */}
        <View className="bg-orange-50 rounded-2xl p-5 mb-6">
          <Text className="text-sm text-gray-600">Shipping Address</Text>
          <Text className="font-bold text-lg mt-1">
            778 Locust View Drive Oakland, CA
          </Text>
        </View>

        {/* Order Summary */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">Order Summary</Text>
          {items.map((item) => (
            <View key={item.id} className="flex-row items-center mb-3">
              <Image source={item.image} className="w-16 h-16 rounded-xl" />
              <View className="flex-1 ml-4">
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-orange-600 font-bold">
                  ${item.price.toFixed(2)} × {item.qty}
                </Text>
              </View>
              <Text className="font-bold text-lg">
                ${(item.price * item.qty).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-6 flex-row items-center">
          <View className="w-12 h-12 bg-orange-100 rounded-xl items-center justify-center">
            <Text className="text-2xl">Credit Card</Text>
          </View>
          <View className="ml-4 flex-1">
            <Text className="font-bold">Credit Card</Text>
            <Text className="text-gray-600">•••• •••• •••• 3000</Text>
          </View>
        </View>

        {/* Delivery Time */}
        <View className="bg-gray-50 rounded-2xl p-5 mb-8">
          <Text className="font-bold text-3xl text-orange-600 mb-1">25 mins</Text>
          <Text className="text-gray-600">Estimated Delivery</Text>
        </View>

        {/* Pay Now Button */}
        <TouchableOpacity
          onPress={() => {
            // TODO: Gọi API thanh toán
            router.replace("/cart/order-confirmed");
          }}
          className="bg-orange-500 py-5 rounded-full shadow-2xl"
        >
          <Text className="text-white text-center text-xl font-bold">Pay Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}