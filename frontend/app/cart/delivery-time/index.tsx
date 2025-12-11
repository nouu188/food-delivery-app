// app/cart/delivery-time/index.tsx
import AuthHeader from "@/components/ui/AuthHeader";
import { router } from "expo-router";
import { Check } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const timeline = [
  { label: "Your order has been accepted", time: "2 min", done: true },
  { label: "The restaurant is preparing your order", time: "5 min", done: true },
  { label: "The delivery is on his way", time: "10 min", done: false },
  { label: "Your order has been delivered", time: "8 min", done: false },
];

export default function DeliveryTimeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#F9CF63]">
      <AuthHeader title="Delivery Time" />

      {/* Phần trắng bo góc trên – KHÔNG TRÀN, ĐẸP TỪNG PIXEL */}
      <View className="flex-1 bg-white rounded-t-[40px] -mt-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }} // Đủ chỗ cho nút cố định
          className="flex-1"
        >
          {/* Shipping Address */}
          <View className="mx-6 mt-6">
            <View className="bg-[#FFF8E1] rounded-2xl p-5 shadow-sm">
              <Text className="text-sm text-gray-600 font-medium">Shipping Address</Text>
              <Text className="text-lg font-bold text-gray-900 mt-1">
                778 Locust View Drive Oakland, CA
              </Text>
            </View>
          </View>

          {/* Map */}
          <View className="mx-6 mt-6">
            <View className="rounded-3xl overflow-hidden h-56 shadow-lg">
              <Image
                source={{ uri: "https://via.placeholder.com/600x400/34C759/FFFFFF?text=Map+Delivery+Route" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Delivery Time */}
        <View className="mx-6 mt-6">
        <View className="bg-[#FFF8E1] rounded-3xl px-6 py-5 shadow-sm">

            <Text className="text-xl font-bold text-gray-900 mb-1">Delivery Time</Text>

            {/* Estimated Delivery + 25 mins trên 1 dòng */}
            <View className="flex-row items-baseline">
            <Text className="text-gray-600 text-lg font-semibold">Estimated Delivery</Text>

            <View className="flex-row items-baseline ml-16">
                <Text className="text-4xl font-extrabold text-[#E95322]">25</Text>
                <Text className="text-2xl font-bold text-gray-700 ml-1">mins</Text>
            </View>
            </View>

        </View>
        </View>



          {/* Timeline */}
          <View className="mx-6 mt-6 pb-5">
            {timeline.map((step, index) => (
              <View key={index} className="flex-row items-start mb-6">
                <View className="items-center mr-4">
                  <View
                    className={`w-5 h-5 rounded-full items-center justify-center ${
                      step.done ? "bg-[#E95322]" : "bg-gray-300"
                    }`}
                  >
                    {step.done && <Check size={24} color="white" strokeWidth={3} />}
                  </View>
                  {index < timeline.length - 1 && (
                    <View
                      className={`w-0.5 h-16 -mt-2 ${
                        step.done ? "bg-[#E95322]" : "bg-gray-300"
                      }`}
                    />
                  )}
                </View>

                <View className="flex-1 pt-1">
                  <Text
                    className={`font-medium text-base ${
                      step.done ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* NÚT CỐ ĐỊNH DƯỚI MÀN HÌNH – KHÔNG BAO GIỜ BỊ TRÀN */}
        <View className="absolute bottom-8 left-6 right-6 flex-row gap-4">
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home")}
            className="flex-1 bg-gray-200 py-5 rounded-full shadow-lg"
          >
            <Text className="text-center font-bold text-gray-700 text-lg">
              Return Home
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 bg-[#E95322] py-5 rounded-full shadow-xl">
            <Text className="text-white text-center font-bold text-lg">
              Track Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}